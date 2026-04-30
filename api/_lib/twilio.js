// api/_lib/twilio.js — shared Twilio REST helper
// Sends a WhatsApp message via Twilio REST API.
// Used by both api/whatsapp.js and api/admin/chats/[from]/send.js

module.exports = async function sendWhatsApp(to, body) {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_WHATSAPP_NUMBER;
  if (!sid || !token || !from) throw new Error('Twilio env vars missing');

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const params = new URLSearchParams({ To: to, From: from, Body: body });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Twilio ${res.status}: ${txt}`);
  }
  return res.json();
};
