// Motor de formularios: conecta cualquier elemento con data-campo="seccion.campo"
// al estado, valida y pinta errores. Los pasos solo aportan su navegación.
import { solicitud, obtener, establecer, marcarTocado, marcarIntento } from '../estado.js';
import { VALIDADORES, validarPaso } from '../validaciones.js';
import { $, $$, setValor } from '../dom.js';
import { formatearMiles, soloDigitos, formatearTarjeta, formatearVencimiento } from '../formato.js';

// Cómo se lee de la pantalla (leer), cómo se muestra (mostrar) y si se corrige mientras se escribe (enVivo)
const CAMPOS = {
  'equipo.valor': { leer: (v) => Number(soloDigitos(v).slice(0, 9)) || 0, mostrar: (v) => (v ? formatearMiles(v) : ''), enVivo: false },
  'titular.dni': { leer: (v) => soloDigitos(v).slice(0, 8), enVivo: true },
  'pago.tarjeta': { leer: formatearTarjeta, enVivo: true },
  'pago.vencimiento': { leer: formatearVencimiento, enVivo: true },
  'pago.cvv': { leer: (v) => soloDigitos(v).slice(0, 3), enVivo: true },
};

const esAtomico = (c) => c.tagName === 'SELECT' || c.type === 'radio' || c.type === 'checkbox';

export function conectarFormularios() {
  const alEscribir = (e) => {
    const control = e.target;
    const campoEl = control.closest?.('[data-campo]');
    if (!campoEl || (control.type === 'radio' && !control.checked)) return;
    const ruta = campoEl.dataset.campo;
    const def = CAMPOS[ruta] ?? {};
    const crudo = control.type === 'checkbox' ? control.checked : control.value;
    const nuevo = def.leer ? def.leer(crudo) : crudo;
    if (def.enVivo && control.value !== nuevo) control.value = nuevo;
    if (esAtomico(control)) solicitud.ui.tocados[ruta] = true; // select/radio/checkbox: no hay "salir del campo"
    establecer(ruta, nuevo);
  };
  document.addEventListener('input', alEscribir);
  document.addEventListener('change', alEscribir);

  // Error en línea al salir del campo (blur)
  document.addEventListener('focusout', (e) => {
    const campoEl = e.target.closest?.('[data-campo]');
    if (campoEl) marcarTocado(campoEl.dataset.campo);
  });
}

// Un <form novalidate> por paso: Enter y el botón principal pasan por acá
export function conectarEnvio(seccion, alEnviar) {
  $('form', seccion).addEventListener('submit', (e) => {
    e.preventDefault();
    alEnviar();
  });
  // "Revisar": muestra todos los errores y lleva el foco al primero
  $('[data-accion="mostrar-errores"]', seccion)?.addEventListener('click', () => {
    revelarErrores(seccion, Number(seccion.dataset.paso));
  });
}

export function revelarErrores(seccion, paso) {
  marcarIntento(paso);
  const primera = Object.keys(validarPaso(paso, solicitud))[0];
  if (primera) $(`[data-campo="${primera}"] input, [data-campo="${primera}"] select`, seccion)?.focus();
}

export function mostrarError(campoEl, mensaje) {
  const invalido = Boolean(mensaje);
  campoEl.toggleAttribute('data-invalid', invalido);
  $$('input, select', campoEl).forEach((c) => {
    if (c.type === 'radio') return;
    if (invalido) c.setAttribute('aria-invalid', 'true');
    else c.removeAttribute('aria-invalid');
  });
  const p = $('[data-error]', campoEl);
  if (p) { p.textContent = mensaje ?? ''; p.hidden = !invalido; }
  const ayuda = $('[data-ayuda]', campoEl);
  if (ayuda) ayuda.hidden = invalido;
}

// Pinta TODO el paso desde el estado: valores, errores y botón principal
export function pintarPaso(seccion, paso) {
  const intento = Boolean(solicitud.ui.intentos[paso]);
  $$('[data-campo]', seccion).forEach((campoEl) => {
    const ruta = campoEl.dataset.campo;
    const valor = obtener(ruta);
    const def = CAMPOS[ruta] ?? {};
    $$('input, select', campoEl).forEach((c) => {
      if (c.type === 'radio') c.checked = c.value === valor;
      else if (c.type === 'checkbox') c.checked = Boolean(valor);
      else setValor(c, def.mostrar ? def.mostrar(valor) : valor);
    });
    const error = VALIDADORES[ruta]?.(valor) ?? null;
    mostrarError(campoEl, error && (solicitud.ui.tocados[ruta] || intento) ? error : null);
  });
  actualizarBoton(seccion, paso);
}

function actualizarBoton(seccion, paso) {
  const faltantes = Object.keys(validarPaso(paso, solicitud));
  const boton = $('[data-accion-principal]', seccion);
  if (boton) boton.disabled = faltantes.length > 0 || solicitud.ui.pagando || solicitud.ui.cargando;

  // Un botón deshabilitado explica qué falta
  const ayuda = $('[data-ayuda-boton]', seccion);
  if (!ayuda) return;
  ayuda.hidden = faltantes.length === 0;
  if (faltantes.length === 0) return;
  const etiquetas = faltantes.map((r) => $(`[data-campo="${r}"]`, seccion)?.dataset.etiqueta).filter(Boolean);
  $('[data-texto]', ayuda).textContent = etiquetas.length <= 3
    ? `Falta completar: ${etiquetas.join(', ')}.`
    : `Faltan completar ${etiquetas.length} campos.`;
}

