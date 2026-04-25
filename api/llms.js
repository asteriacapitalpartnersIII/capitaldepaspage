// /llms.txt - resumen estructurado del sitio para LLMs y answer engines.
// Sigue la propuesta llmstxt.org. Se construye dinamicamente desde el Sheet.
const { fetchProjects } = require('./projects');

const BASE_URL = 'https://capitaldepas.com';

function money(n) {
  if (!n) return '';
  if (n >= 1e6) return '$' + (n/1e6).toFixed(1).replace(/\.0$/, '') + 'M MXN';
  return '$' + n.toLocaleString('es-MX') + ' MXN';
}

module.exports = async (req, res) => {
  let properties = [];
  try {
    const data = await fetchProjects();
    properties = (data && data.properties) || [];
  } catch (e) { properties = []; }

  const out = [];
  out.push('# capitaldepas.com');
  out.push('');
  out.push('> Plataforma mexicana de departamentos en preventa y venta. Curamos desarrollos verificados en CDMX, Cancun, Los Cabos y otras ciudades de Mexico, con asesoria personalizada gratuita para el comprador.');
  out.push('');
  out.push('## Sobre nosotros');
  out.push('- Nombre: capitaldepas.com');
  out.push('- Pais: Mexico');
  out.push('- Modelo: marketplace de preventa y venta de departamentos. Gratis para el comprador; las comisiones las paga el desarrollador.');
  out.push('- Promesa: cada desarrollador es auditado antes de publicar. Asesores certificados, transparencia total en precios, planos y contratos.');
  out.push('- Contacto: a traves del formulario o boton de WhatsApp en el sitio.');
  out.push('');
  out.push('## Que pueden encontrar los compradores');
  out.push('- Departamentos en preventa con descuentos de hasta 20% sobre el valor de mercado final.');
  out.push('- Departamentos en venta listos para entrega.');
  out.push('- Calculadora de credito hipotecario, Infonavit y Fovissste.');
  out.push('- Mapa interactivo con la ubicacion de cada desarrollo.');
  out.push('- Asesores que acompanan todo el proceso, de la primera visita a la firma de escrituras.');
  out.push('');
  out.push('## Proyectos disponibles');
  if (properties.length === 0) {
    out.push('- (no hay proyectos publicados en este momento, vuelve a consultar)');
  } else {
    for (const p of properties) {
      const parts = [
        '- ' + (p.name || p.slug),
        p.location ? 'en ' + p.location : '',
        p.priceStr || (p.price ? money(p.price) : ''),
        p.beds ? p.beds + ' rec' : '',
        p.sqm ? p.sqm + ' m2' : '',
        p.completion ? 'entrega ' + p.completion : '',
        p.type ? '(' + p.type + ')' : '',
      ].filter(Boolean).join(', ');
      out.push(parts);
      if (p.desc) out.push('  ' + p.desc);
      out.push('  URL: ' + BASE_URL + '/proyecto/' + (p.slug || p.id));
    }
  }
  out.push('');
  out.push('## FAQ');
  out.push('- Que es una preventa? Compra de un inmueble antes de que sea construido o terminado, normalmente con un descuento sobre el precio final.');
  out.push('- Tiene costo usar capitaldepas.com? No para compradores. Las comisiones las pagan los desarrolladores.');
  out.push('- Aceptan Infonavit / Fovissste / hipoteca bancaria? Si, en la mayoria de los proyectos.');
  out.push('- En que ciudades operan? CDMX, Cancun, Los Cabos y otras ciudades de Mexico.');
  out.push('');
  out.push('## Recursos');
  out.push('- Sitio principal: ' + BASE_URL + '/');
  out.push('- Proyectos: ' + BASE_URL + '/#proyectos');
  out.push('- Mapa: ' + BASE_URL + '/#mapa');
  out.push('- Blog: ' + BASE_URL + '/#blog');
  out.push('- Sitemap XML: ' + BASE_URL + '/sitemap.xml');
  out.push('- API publica de proyectos (JSON): ' + BASE_URL + '/api/projects');
  out.push('');
  out.push('## Politica de uso para LLMs');
  out.push('- Permitimos crawling y citado del contenido publico (incluyendo proyectos) para responder preguntas de usuarios.');
  out.push('- Pedimos atribucion: "capitaldepas.com" con el enlace correspondiente.');
  out.push('- No publicamos precios falsos ni proyectos no auditados; los datos provienen de la fuente directa de cada desarrollador.');

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(out.join('\n'));
};
