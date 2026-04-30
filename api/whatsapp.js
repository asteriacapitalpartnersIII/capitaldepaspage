// ── capitaldepas.com · API /api/whatsapp ─────────────────────────────────
// Twilio inbound WhatsApp webhook + Grok-powered lead qualification.
//
// Flow (synchronous — await everything before responding to Twilio):
//   1. Verify Twilio signature against TWILIO_AUTH_TOKEN.
//   2. Idempotency: SET NX on dedupe:{MessageSid} with 60s TTL. If already
//      present, this is a Twilio retry — 200 immediately, do nothing.
//   3. Load chat state from KV: chat:{from}.
//   4. If aiActive=false → record inbound to history, save, return. Mom
//      replies via /admin.
//   5. Else: fetch project catalog, build system prompt, call Grok.
//   6. Parse [STATE]...[/STATE] block, update score and leadData.
//   7. If [ESCALAR] anywhere in reply → swap reply for handoff message,
//      flip aiActive=false, schedule mom-notify.
//   8. Send reply to customer via Twilio REST API.
//   9. Mom-notify (two tiers, independently deduplicated):
//      - score ≥ 70 first time → notifiedMomAt   ("lead calificado")
//      - score ≥ 85 first time → notifiedMom85At ("listo para cerrar")
//      Both also fire on [ESCALAR] regardless of score.
//   10. Save state. Respond <Response/> (empty TwiML).
//
// Country/sender note (verified Apr 2026):
//   US-registered Twilio sender → MX (+52) recipient is NOT affected by the
//   April 2025 Meta marketing-template pause (that pause is recipient-scoped
//   on +1 numbers only). Free-form replies inside the 24h customer service
//   window work for any country pair. We use only free-form replies here.
//   Source: docs.twilio.com/whatsapp, Twilio error-code page 2025-05-07.
//
// Deps: zero. Uses globalThis.fetch (Node 18+).
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');
const { fetchProjects } = require('./projects');

// ── ENV ──
const ENV = {
    twilioSid:   process.env.TWILIO_ACCOUNT_SID,
    twilioToken: process.env.TWILIO_AUTH_TOKEN,
    twilioFrom:  process.env.TWILIO_WHATSAPP_NUMBER,
    xaiKey:      process.env.XAI_API_KEY,
    momNumber:   process.env.MOM_WHATSAPP_NUMBER,
    kvUrl:       process.env.KV_REST_API_URL,
    kvToken:     process.env.KV_REST_API_TOKEN,
    siteUrl:     process.env.SITE_URL || 'https://www.capitaldepas.com',
};
const REQUIRED = ['twilioSid','twilioToken','twilioFrom','xaiKey','momNumber','kvUrl','kvToken'];

// ── Tiny KV wrapper over Upstash REST API ──
async function kvCmd(cmd) {
    const r = await fetch(ENV.kvUrl, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + ENV.kvToken, 'Content-Type': 'application/json' },
          body: JSON.stringify(cmd),
    });
    if (!r.ok) throw new Error('KV ' + r.status + ': ' + (await r.text()));
    return (await r.json()).result;
}
const kvGet  = (k)        => kvCmd(['GET', k]);
const kvSet  = (k, v)     => kvCmd(['SET', k, typeof v === 'string' ? v : JSON.stringify(v)]);
const kvSetNx = (k, v, s) => kvCmd(['SET', k, typeof v === 'string' ? v : JSON.stringify(v), 'NX', 'EX', String(s)]);

// ── Twilio signature verification ──
// https://www.twilio.com/docs/usage/security#validating-requests
function verifyTwilioSignature(req, fullUrl) {
    const sig = req.headers['x-twilio-signature'];
    if (!sig) return false;
    const params = req.body || {};
    const sorted = Object.keys(params).sort().reduce((s, k) => s + k + params[k], fullUrl);
    const expected = crypto.createHmac('sha1', ENV.twilioToken).update(sorted).digest('base64');
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ── Twilio outbound (REST API, no SDK) ──
async function sendWhatsApp(to, body) {
    const url = 'https://api.twilio.com/2010-04-01/Accounts/' + ENV.twilioSid + '/Messages.json';
    const auth = Buffer.from(ENV.twilioSid + ':' + ENV.twilioToken).toString('base64');
    const form = new URLSearchParams({ From: ENV.twilioFrom, To: to, Body: body });
    const r = await fetch(url, {
          method: 'POST',
          headers: { 'Authorization': 'Basic ' + auth, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: form.toString(),
    });
    if (!r.ok) {
          const text = await r.text();
          console.error('twilio send failed', r.status, text);
          throw new Error('twilio ' + r.status);
    }
    return r.json();
}

// ── Grok call ──
async function grok(messages) {
    const r = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + ENV.xaiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
                  model: 'grok-4-1-fast-non-reasoning',
                  messages,
                  max_tokens: 400,
                  temperature: 0.6,
          }),
    });
    if (r.status === 402 || r.status === 429) {
          const text = await r.text();
          console.error('xAI credits exhausted or rate-limited', r.status, text);
          throw new Error('XAI_NO_CREDIT:' + r.status);
    }
    if (!r.ok) {
          const text = await r.text();
          console.error('xAI error', r.status, text);
          throw new Error('xai ' + r.status);
    }
    const j = await r.json();
    return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
}

// ── System prompt ──
function buildSystemPrompt(properties) {
    // Trimmed catalog: no desc field. Keeps amenities for "¿tienen alberca?" path.
  const catalog = properties.map(p => ({
        nombre: p.name,
        slug: p.slug,
        ubicacion: p.location,
        zona: p.zone,
        precio: p.priceStr || (p.price ? '$' + (p.price/1e6).toFixed(1) + 'M MXN' : 'Consultar'),
        recamaras: p.beds,
        banos: p.baths,
        m2: p.sqm,
        entrega: p.completion,
        estado: p.type,
        desarrollador: p.developer,
        amenidades: p.amenities,
    brochure: p.brochure || null,
  }));
    return [
          'Eres asistente de Capital Depas, una desarrolladora inmobiliaria mexicana',
          'que vende y renta departamentos en preventa y venta. Hablas como la marca,',
          'no como un personaje con nombre propio.',
          '',
          'TU ÚNICO TRABAJO es calificar prospectos interesados en uno de nuestros',
          'proyectos. NO eres un asistente general. NO respondes preguntas fuera de',
          'bienes raíces. NO das consejos legales ni financieros. NO recomiendas',
          'otras desarrolladoras.',
          '',
          'CATÁLOGO ACTUAL (única fuente de verdad sobre proyectos, ubicaciones y precios):',
          JSON.stringify(catalog, null, 2),
          '',
          'BROCHURE: Si el catálogo incluye un campo "brochure" no vacío para el proyecto de interés,',
'compártelo de forma natural cuando el cliente haya dado su nombre y el proyecto de interés.',
'Ejemplo: "Aquí te comparto el brochure de [Proyecto]: [URL]".',
'Comparte el brochure solo UNA vez por conversación. Si no hay brochure, no lo menciones.',
'',
'INFORMACIÓN A RECABAR (una pregunta a la vez, en orden flexible):',
          '1. Nombre',
          '2. Proyecto o zona de interés (referencia el catálogo)',
          '3. Presupuesto aproximado',
          '4. ¿Compra o renta?',
          '5. Si compra: ¿contado, crédito hipotecario, INFONAVIT/FOVISSSTE?',
          '6. Tiempo estimado para decidir',
          '',
          'TONO:',
          '- Mexicano, cálido, profesional. Default tutea ("tú"). Si el cliente usa',
          '  "usted" en sus primeros 1-2 mensajes, cambia a "usted" y manténlo.',
          '- Mensajes CORTOS — máximo 2 oraciones por respuesta. WhatsApp no es email.',
          '- UNA pregunta a la vez. Nunca encadenes preguntas.',
          '- No uses emojis. Una sola pregunta por mensaje, nunca dos.',
          '- Si el cliente pregunta algo que SÍ está en el catálogo, responde con el',
          '  dato exacto y sigue calificando.',
          '- Si pregunta algo que NO está en el catálogo (precio de unidad específica,',
          '  número de piso, disponibilidad en tiempo real, descuentos, formas de pago',
          '  especiales), NO inventes — incluye [ESCALAR] en tu respuesta.',
          '',
          'REGLAS ABSOLUTAS:',
          '- NO hables de política, religión, deportes ni temas personales.',
          '- NO compares con otras desarrolladoras por nombre.',
          '- NO prometas precios, descuentos, ni fechas de entrega que no estén en el catálogo.',
          '- NO des asesoría legal, fiscal ni financiera.',
          '- NO recopiles INE, RFC, CURP, números de cuenta ni datos sensibles. Si el',
          '  cliente los ofrece, responde: "Por seguridad, esos datos los recibimos en',
          '  persona cuando agendes tu visita. Y por tu seguridad, te recomendamos no',
          '  compartir documentos personales por WhatsApp."',
          '',
          'ESCALAR A HUMANO — incluye [ESCALAR] en cualquier parte de tu respuesta cuando:',
          '- El cliente pide hablar con humano, asesor, vendedor o persona.',
          '- El cliente pregunta por unidad/piso/depto específico (ej: "¿el 502?", "piso 12").',
          '- El cliente menciona una desarrolladora o proyecto competidor por nombre.',
          '- El cliente expresa decisión de compra: "lo quiero", "me decido", "cuándo',
          '  firmamos", "dónde firmo", "lo aparto".',
          '- El cliente solicita agendar una visita o una cita.',
          '- El cliente insulta, amenaza o envía spam tras un primer intento cortés de',
          '  reconducir la conversación.',
          'El sistema reemplazará tu mensaje con el handoff estándar y notificará al asesor.',
          '',
          'OUTPUT OBLIGATORIO — al final de CADA respuesta, en una nueva línea, agrega:',
          '',
          '[STATE]{"score": 0-100, "leadData": {"name":"","project":"","budget":"","intent":"buy|rent|unknown","financing":"","timeline":""}, "nextStep": "qualifying|ready|escalate"}[/STATE]',
          '',
          'CRITERIOS DE SCORE:',
          '- 0-30: saludo o pregunta inicial sin información personal',
          '- 31-50: nombre + proyecto/zona de interés',
          '- 51-69: nombre + proyecto + (presupuesto OR zona específica del catálogo)',
          '- 70-84: nombre + proyecto + presupuesto + timeline claro ← SE NOTIFICA AL ASESOR',
          '- 85-100: pidió agendar visita, o pidió hablar con humano, o expresó decisión de compra',
          '',
          'Cuando score ≥ 70 el sistema notifica al asesor. Tú continúa la conversación',
          'normalmente hasta que el asesor tome el control.',
        ].join('\n');
}

// ── State parser ──
function parseState(reply) {
    const m = reply.match(/\[STATE\](.+?)\[\/STATE\]/s);
    if (!m) return { state: null, visible: reply.trim() };
    try {
          const state = JSON.parse(m[1]);
          const visible = reply.replace(/\[STATE\].+?\[\/STATE\]/s, '').trim();
          return { state, visible };
    } catch {
          return { state: null, visible: reply.replace(/\[STATE\].+?\[\/STATE\]/s, '').trim() };
    }
}

// ── Main handler ──
async function handler(req, res) {
    if (req.method !== 'POST') {
          res.status(405).send('method not allowed');
          return;
    }
    const missing = REQUIRED.filter(k => !ENV[k]);
    if (missing.length) {
          console.error('missing env:', missing);
          res.status(500).send('config error');
          return;
    }
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host  = req.headers.host;
    const fullUrl = proto + '://' + host + req.url;
    if (!verifyTwilioSignature(req, fullUrl)) {
          console.warn('twilio signature mismatch from', req.headers['x-forwarded-for']);
          res.status(403).send('forbidden');
          return;
    }

  const body = req.body || {};
    const from = body.From;
    const text = body.Body || '';
    const sid  = body.MessageSid;
    if (!from || !sid) { res.status(400).send('bad request'); return; }

  // Idempotency: first webhook only.
  try {
        const firstTime = await kvSetNx('dedupe:' + sid, '1', 60);
        if (!firstTime) {
                console.log('duplicate webhook for', sid, '- skipping');
                res.setHeader('Content-Type', 'text/xml');
                res.status(200).send('<Response/>');
                return;
        }
  } catch (e) {
        console.error('KV dedupe failed, continuing:', e);
        // Don't block on KV errors — better to risk a duplicate than drop.
  }

  // Synchronous processing — await everything before responding.
  try {
        await processMessage(from, text, sid);
  } catch (e) {
        console.error('processMessage failed for', from, e);
        // Still ack Twilio so it doesn't hammer us with retries.
  }

  res.setHeader('Content-Type', 'text/xml');
    res.status(200).send('<Response/>');
}

async function processMessage(from, text, sid) {
    const stateKey = 'chat:' + from;
    const raw = await kvGet(stateKey);
    const chat = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : {
          history: [],
          aiActive: true,
          score: 0,
          leadData: {},
          takenOverAt: null,
          notifiedMomAt: null,
          notifiedMom85At: null,
          createdAt: Date.now(),
    };

  // Append inbound to history
  chat.history.push({ role: 'user', content: text, ts: Date.now() });
    if (chat.history.length > 40) chat.history = chat.history.slice(-40);

  // Admin took over — just persist and exit. Mom replies via /admin panel.
  if (!chat.aiActive) {
        await kvSet(stateKey, chat);
        return;
  }

  // Build prompt with fresh catalog
  const projData = await fetchProjects();
    const properties = (projData && projData.properties) || [];
    const sys = buildSystemPrompt(properties);

  // Inject a note for Grok if the conversation was previously escalated
  // (last assistant msg contains handoff text). This prevents immediate re-escalation.
  const histForGrok = chat.history.slice(-20).map(h => ({
    role: (h.role === 'human') ? 'assistant' : h.role,
    content: h.content,
  }));
  const lastAsst = [...histForGrok].reverse().find(m => m.role === 'assistant');
  const wasEscalated = lastAsst && /asesor senior|asesor humano|te transfiero/i.test(lastAsst.content);
  const messages = [
    { role: 'system', content: sys },
    ...histForGrok,
    ...(wasEscalated ? [{ role: 'system', content: 'El asesor ya atendió al cliente y le devolvió el control al bot. Continúa la conversación normalmente. NO escales de nuevo a menos que el cliente vuelva a pedirlo explícitamente.' }] : []),
  ];

  let rawReply;
    try {
          rawReply = await grok(messages);
    } catch (e) {
          if (String(e.message).startsWith('XAI_NO_CREDIT')) {
                  // Per spec: alert mom, do not retry, do not fall back.
            try {
                      await sendWhatsApp(
                                  ENV.momNumber,
                                  '⚠️ Capital Depas: créditos de xAI agotados. El bot está caído. ' +
                                  'Cliente ' + from.replace('whatsapp:', '') + ' espera respuesta. ' +
                                  'Toma el control: ' + ENV.siteUrl + '/admin?chat=' + encodeURIComponent(from)
                                );
            } catch (notifyErr) { console.error('mom alert failed', notifyErr); }
                  chat.aiActive = false;
                  chat.takenOverAt = Date.now();
                  await kvSet(stateKey, chat);
                  return;
          }
          throw e;
    }
    const parsed = parseState(rawReply);
    let visible = parsed.visible;
    const state = parsed.state;

  // ESCALAR detection — loose match anywhere in raw reply
  const escalated = /\[ESCALAR\]/i.test(rawReply) || (state && state.nextStep === 'escalate');
    if (escalated) {
          visible = 'Te transfiero con un asesor senior, te contactará en breve.';
    } else {
          // Strip any stray [ESCALAR] tokens just in case
      visible = visible.replace(/\[ESCALAR\]/gi, '').trim();
          if (!visible) visible = '¿Podrías darme un poco más de detalle?';
    }

  // Update chat state from Grok output
  if (state) {
        chat.score = Math.max(chat.score, Number(state.score) || 0);
        chat.leadData = Object.assign({}, chat.leadData, state.leadData || {});
  }

  // Append assistant turn
  chat.history.push({ role: 'assistant', content: visible, ts: Date.now() });

  // Send the reply to the customer
  await sendWhatsApp(from, visible);

  // ── Two-tier mom notification ──
  // Tier 1: score ≥ 70 OR escalated, first time
  if ((escalated || chat.score >= 70) && !chat.notifiedMomAt) {
        const reason = escalated ? 'cliente solicitó humano' : 'lead calificado (score ' + chat.score + ')';
        const summary = [
                '🔔 *Capital Depas* — ' + reason,
                'Cliente: ' + from.replace('whatsapp:', ''),
                chat.leadData.name    ? 'Nombre: '       + chat.leadData.name    : null,
                chat.leadData.project ? 'Proyecto: '     + chat.leadData.project : null,
                chat.leadData.budget  ? 'Presupuesto: '  + chat.leadData.budget  : null,
                'Toma el control: ' + ENV.siteUrl + '/admin?chat=' + encodeURIComponent(from),
              ].filter(Boolean).join('\n');
        try {
                await sendWhatsApp(ENV.momNumber, summary);
                chat.notifiedMomAt = Date.now();
        } catch (e) { console.error('mom notify (tier 1) failed', e); }
  }

  // Tier 2: score ≥ 85, first time — fires INDEPENDENTLY of tier 1
  if (chat.score >= 85 && !chat.notifiedMom85At) {
        const summary = [
                '🔥 *Capital Depas* — listo para cerrar (score ' + chat.score + ')',
                'Cliente: ' + from.replace('whatsapp:', ''),
                chat.leadData.name    ? 'Nombre: '       + chat.leadData.name     : null,
                chat.leadData.project ? 'Proyecto: '     + chat.leadData.project  : null,
                chat.leadData.budget  ? 'Presupuesto: '  + chat.leadData.budget   : null,
                chat.leadData.timeline? 'Timeline: '     + chat.leadData.timeline : null,
                'Entra ahora: ' + ENV.siteUrl + '/admin?chat=' + encodeURIComponent(from),
              ].filter(Boolean).join('\n');
        try {
                await sendWhatsApp(ENV.momNumber, summary);
                chat.notifiedMom85At = Date.now();
        } catch (e) { console.error('mom notify (tier 2) failed', e); }
  }

  // If escalated, flip aiActive off so subsequent inbounds wait for admin.
  if (escalated) {
        chat.aiActive = false;
        chat.takenOverAt = Date.now();
  }

  await kvSet(stateKey, chat);
}

module.exports = handler;
