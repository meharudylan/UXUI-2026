# Cubrí Seguros · Flujo de contratación digital (Seguro de Celular)

TP5 · Diseño UXUI 2026 · Lic. en Sistemas de Información (FCyT).
Stack: HTML5 · Tailwind CSS v4 (CDN) · Basecoat UI · JavaScript vanilla (módulos ES). Sin backend.

- **Sitio publicado:** _pegar URL acá_
- **Figma:** _pegar link acá_

## Cómo correrlo

No hace falta compilar nada, pero **no se puede abrir con doble click** (`file://`): el navegador bloquea los `fetch` de `data/planes.json` y `partials/`.

```bash
npx serve .          # o "Live Server" en VS Code
```

Tests de la lógica (cuotas, validaciones, pago simulado): `node tests/casos.mjs`.

## Dónde tocar cada cosa

`index.html` contiene las 7 pantallas como `<section data-paso="...">` que se muestran u ocultan con el atributo `hidden` (sección 3.1 y 6.3 del PRD). La lógica de JavaScript está totalmente desacoplada y modularizada en archivos específicos dentro de `js/`.

| Pantalla | Sección en index.html | Lógica de la pantalla |
|---|---|---|
| 01 Inicio / Catálogo | `<section data-paso="0">` | `js/pasos/inicio.js` |
| 02 Cotizar (paso 1) | `<section data-paso="1">` | `js/pasos/cotizar.js` |
| 03 Elegir plan (paso 2) | `<section data-paso="2">` | `js/pasos/planes.js` |
| 04 Datos personales (paso 3) | `<section data-paso="3">` | `js/pasos/datos.js` |
| **05 Pago (paso 4)** | `<section data-paso="4">` | `js/pasos/paso-pago.js` · reglas en `js/pago.js` |
| 06 Éxito | `<section data-paso="5">` | `js/pasos/exito.js` |
| 07 Error de pago | `<section data-paso="6">` | `js/pasos/error.js` |
| Resumen (card lateral) | `<aside id="resumen">` | `js/componentes/resumen.js` |
| Stepper | `<ol id="stepper">` | `js/componentes/stepper.js` |

Piezas compartidas:

- `js/estado.js`: **un único objeto** `solicitud` + `irAPaso()`, `reiniciar()`. Todo cambio termina en `render()`.
- `js/render.js`: muestra/oculta `<section data-paso>` y llama al `pintar()` del paso activo.
- `js/validaciones.js`: funciones puras (valor → mensaje o `null`) + qué campos tiene cada paso.
- `js/cotizador.js`: `calcularCuota()`, la única función que calcula precios.
- `js/componentes/formulario.js`: motor de formularios. Cualquier elemento con `data-campo="seccion.campo"` queda conectado al estado, se valida en `blur` y muestra su error.
- `css/tokens.css` (tokens del Figma) · `css/ajustes.css` (retoques sobre Basecoat) · `css/layout.css` (qué se ve en mobile/desktop según el paso).

Para agregar un campo: ponerlo en el partial con `data-campo="..."`, agregarlo al estado (`estado.js`) y registrar su validador en `validaciones.js`.

## Decisiones tomadas

- **Arquitectura modular sin spaghetti**: las 7 pantallas definidas como `<section data-paso>` en `index.html` siguiendo la sección 3.1 y 6.3 del PRD, con toda la lógica de JS distribuida en módulos independientes (`estado.js`, `cotizador.js`, `validaciones.js`, `pago.js`, `pasos/`).
- **El estado manda**: el DOM nunca se lee para calcular. Los inputs se rellenan desde el estado en cada `render()`, por eso "Volver" y "Reintentar pago" conservan los datos.
- **Un solo resumen** generado desde el estado: card lateral en desktop, bloque superior en Pago mobile y barra compacta en Plan mobile.
- **Errores en `blur`** y revalidación total al intentar avanzar. Como el botón deshabilitado no recibe clicks, el texto bajo el botón explica qué falta y su enlace "Ver qué falta" muestra todos los errores y enfoca el primero.
- **Mobile first**: una columna y acciones en barra fija; desde `lg:` dos columnas y botones en fila.
- **Pago**: botón en "Procesando…" y deshabilitado durante 1,5 s; el doble click/Enter se ignora mientras `ui.pagando` es `true`.
- Se agregó el campo **Titular** de la tarjeta también en mobile (el Figma mobile no lo muestra pero la consigna lo pide).
- Las cards de plan marcan con ✗ las coberturas que suma el plan siguiente (en el Figma varía por plan).

## Bonus hechos

- Máscaras de input: tarjeta en grupos de 4, vencimiento con barra automática, DNI y CVV solo dígitos.
- "Descargar póliza" genera un `.txt` con el detalle.

## Commits sugeridos (uno por hito)

1. `H1: maquetado de las 7 pantallas (mobile y desktop)`
2. `H2: estado único, render, stepper y navegación con "Volver"`
3. `H3: validaciones en línea, planes.json y cálculo de cuotas`
4. `H4: pago simulado, éxito/error, póliza, README y deploy`

## Capturas

_Agregar capturas mobile (390 px) y desktop (1440 px) de las 7 pantallas en `/capturas` y enlazarlas acá._
