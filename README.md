# capitaldepas.com

Sitio de departamentos en preventa y venta. Código hosted en GitHub, desplegado en Vercel, datos en Google Sheets, fotos en este mismo repo.

---

## Cómo agregar un proyecto nuevo (tu workflow semanal)

### Paso 1 — Sube las fotos al repo

Entra a este repo en GitHub, abre la carpeta `images/projects/` y arrastra las fotos ahí. Nombra cada foto con el patrón `{slug}-NN.jpg`, por ejemplo:

```
torre-polanco-01.jpg
torre-polanco-02.jpg
torre-polanco-03.jpg
```

El **slug** es el identificador corto del proyecto, en minúsculas, sin acentos, con guiones en lugar de espacios. El mismo slug que irás a poner en el Google Sheet.

Tips de higiene:
- Usa JPG para fotos (más ligero). PNG solo si hay transparencia.
- Apunta a 1600px de ancho máximo — más grande no se nota en pantalla y pesa mucho.
- Renombra ANTES de subir. Renombrar en GitHub después rompe los links.
- La primera foto (`-01.jpg`) es la de portada, la que ves en el card del marketplace.

### Paso 2 — Agrega la fila al Google Sheet

Abre la hoja: https://docs.google.com/spreadsheets/d/1Ynfoj4WLF2yaCfe5QN3ToywfsDNwVq2U2LvDqz4smX4/edit

Pestaña **proyectos**. Una fila = un proyecto. Estas son las columnas:

| Columna          | Qué va                                                    | Ejemplo                                              |
|------------------|-----------------------------------------------------------|------------------------------------------------------|
| `slug`           | Identificador corto (el mismo de los nombres de foto)     | `torre-polanco`                                      |
| `nombre`         | Nombre comercial del proyecto                             | `Torre Polanco`                                      |
| `ubicacion`      | Colonia y ciudad                                          | `Polanco, CDMX`                                      |
| `zona`           | Categoría para filtros: cdmx, cancun, cabos, oaxaca...    | `cdmx`                                               |
| `precio`         | Precio desde, en pesos, sin comas ni $                    | `3200000`                                            |
| `precio_texto`   | (opcional) cómo quieres que se muestre                    | `$3.2M`                                              |
| `recamaras`      | Número                                                    | `2`                                                  |
| `banos`          | Número (puede ser 1.5, 2.5, etc.)                         | `2`                                                  |
| `m2`             | Metros cuadrados                                          | `85`                                                 |
| `estado`         | `preventa`, `venta` o `listo`                             | `preventa`                                           |
| `entrega`        | Fecha de entrega                                          | `Q4 2026`                                            |
| `desarrollador`  | Quién desarrolla el proyecto                              | `Grupo Artha`                                        |
| `amenidades`     | Separadas por coma                                        | `Alberca, Gimnasio, Roof garden, Lobby 24h`          |
| `descripcion`    | Párrafo de marketing                                      | `Departamentos de alto diseño en el corazón de...`   |
| `fotos`          | Nombres de archivo separados por coma, en el orden que los quieres ver | `torre-polanco-01.jpg, torre-polanco-02.jpg, torre-polanco-03.jpg` |
| `hue`            | (opcional) 0–360, color de acento del placeholder si una foto no cargara | `220` |
| `destacado`      | `si` para que aparezca en la home                         | `si`                                                 |

**Importante:** no cambies los nombres de los encabezados. Si necesitas una columna nueva, avísame y la agrego al código también.

### Paso 3 — Guarda. Listo.

Entre 5 y 10 minutos el sitio actualiza solo (el servidor cachea la hoja ~5 min). Refresca `capitaldepas.com` y verás tu proyecto vivo.

---

## Cómo agregar un post de blog

Misma hoja, pestaña **blog**. Columnas:

| Columna      | Qué va                                           |
|--------------|--------------------------------------------------|
| `slug`       | `guia-preventa-2026`                             |
| `titulo`     | Título del post                                  |
| `categoria`  | `Guía`, `Tendencias`, `Finanzas`...              |
| `fecha`      | `18 Abr 2026`                                    |
| `lectura`    | `5 min`                                          |
| `resumen`    | Párrafo corto que aparece en el card del blog    |
| `cuerpo`     | Cuerpo completo del post (Markdown permitido)    |
| `portada`    | Nombre de archivo, debe estar en images/projects |
| `hue`        | (opcional) color del placeholder                 |

---

## Estructura del repo

```
capitaldepas/
├── index.html              ← la página (no edites salvo cambios de diseño)
├── js/
│   ├── data.jsx            ← placeholders + lógica de fetch a la API
│   ├── app.jsx             ← el router principal (home, listings, detalle, etc.)
│   ├── hero.jsx            ← 3 variantes de hero (cinematic, grid, editorial)
│   ├── listings.jsx        ← página de marketplace con filtros
│   ├── project-detail.jsx  ← página de detalle de un proyecto
│   ├── nav.jsx             ← la barra de navegación superior + logo
│   ├── footer.jsx          ← footer + botón flotante de WhatsApp
│   ├── contact.jsx         ← página de contacto, form y FAQ
│   ├── calculator.jsx      ← calculadora de crédito hipotecario
│   ├── map-section.jsx     ← mapa de México con proyectos por ciudad
│   ├── blog.jsx            ← sección/página de blog
│   ├── sections.jsx        ← "Cómo funciona", testimonios, features
│   └── cursor.jsx          ← cursor personalizado
├── api/
│   └── projects.js         ← serverless function que lee Google Sheets
├── images/projects/        ← aquí van todas las fotos
├── vercel.json             ← config de hosting
├── package.json
└── README.md               ← este archivo
```

## Cómo funciona técnicamente (por si alguien pregunta)

El sitio es HTML estático + React vía Babel (compilado en el navegador, sin build step). Al cargar, `data.jsx` hace `fetch('/api/projects')`. Ese endpoint es una serverless function que lee la hoja de Google como CSV, la parsea y la entrega como JSON. La respuesta se cachea 5 minutos en el edge de Vercel, así que el sitio carga instantáneo aunque el archivo de Google sea grande.

Si el fetch falla (hoja mal compartida, Google caído, lo que sea), el sitio muestra los proyectos placeholder que están hardcodeados en `data.jsx` — nunca se ve vacío.

## Dominio

- Repo: https://github.com/asteriacapitalpartnersIII/capitaldepaspage
- Deploy: https://vercel.com/asteriacapitalpartners-6914s-projects/capitaldepaspage1
- Google Sheet: https://docs.google.com/spreadsheets/d/1Ynfoj4WLF2yaCfe5QN3ToywfsDNwVq2U2LvDqz4smX4

Para que `capitaldepas.com` apunte al sitio, en Vercel: Settings → Domains → Add `capitaldepas.com`, y luego en tu registrador de dominio apuntar los DNS a Vercel.

## Checklist de configuración inicial (una sola vez)

- [ ] El Google Sheet está compartido como "Cualquier persona con el enlace — lector"
- [ ] Tiene una pestaña llamada `proyectos` con los encabezados de arriba
- [ ] Tiene una pestaña llamada `blog` con los encabezados de arriba
- [ ] Dominio `capitaldepas.com` apuntado a Vercel
- [ ] Número de WhatsApp real reemplazado en `js/contact.jsx` y `js/footer.jsx` (ahora es placeholder `525512345678`)
- [ ] Email de contacto real reemplazado en `js/contact.jsx` (`hola@capitaldepas.com`)
