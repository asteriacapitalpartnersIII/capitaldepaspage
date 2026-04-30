// api/og-cover.js — Fallback OG cover image for Capital Depas
// Returns an SVG 1200x630 with brand colors. Used when a project has no photos.
// Supported by Meta, WhatsApp, LinkedIn, Telegram. Twitter/X prefers raster
// but still renders SVG. Replace with /images/og-cover.jpg if you want raster.

module.exports = function handler(req, res) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#F5F3EE"/>
        <!-- Brand blue accent bar -->
          <rect x="0" y="0" width="8" height="630" fill="#1550E8"/>
            <!-- Wordmark "capitaldepas" -->
              <text
                  x="600" y="295"
                      font-family="Georgia, 'Times New Roman', serif"
                          font-size="72"
                              font-weight="400"
                                  letter-spacing="-1"
                                      fill="#0E0E0C"
                                          text-anchor="middle"
                                              dominant-baseline="middle"
                                                >capitaldepas</text>
                                                  <!-- Tagline -->
                                                    <text
                                                        x="600" y="375"
                                                            font-family="Arial, Helvetica, sans-serif"
                                                                font-size="22"
                                                                    font-weight="400"
                                                                        letter-spacing="4"
                                                                            fill="#9E9890"
                                                                                text-anchor="middle"
                                                                                    dominant-baseline="middle"
                                                                                        text-transform="uppercase"
                                                                                          >DEPARTAMENTOS EN PREVENTA Y VENTA</text>
                                                                                            <!-- Blue dot accent -->
                                                                                              <circle cx="600" cy="445" r="5" fill="#1550E8"/>
                                                                                                <!-- Website -->
                                                                                                  <text
                                                                                                      x="600" y="490"
                                                                                                          font-family="Arial, Helvetica, sans-serif"
                                                                                                              font-size="18"
                                                                                                                  fill="#1550E8"
                                                                                                                      text-anchor="middle"
                                                                                                                          dominant-baseline="middle"
                                                                                                                              letter-spacing="1"
                                                                                                                                >www.capitaldepas.com</text>
                                                                                                                                </svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.status(200).send(svg);
};
