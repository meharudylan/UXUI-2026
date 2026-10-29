// Pantalla 05 · Pago (Paso 4). Aprobado -> Éxito; rechazado -> Error conservando los datos.
import { solicitud, irAPaso, notificar } from '../estado.js';
import { validarPaso } from '../validaciones.js';
import { simularPago, generarPoliza } from '../pago.js';
import { PASO } from '../config-pasos.js';
import { $ } from '../dom.js';
import { conectarEnvio, pintarPaso, revelarErrores } from '../componentes/formulario.js';

const seccion = () => $('[data-paso="4"]');

export function iniciar() {
  conectarEnvio(seccion(), pagar);
}

async function pagar() {
  if (solicitud.ui.pagando) return; // evita el doble click / doble Enter
  if (Object.keys(validarPaso(PASO.PAGO, solicitud)).length) return revelarErrores(seccion(), PASO.PAGO);

  solicitud.ui.pagando = true;
  notificar();
  const resultado = await simularPago(solicitud.pago.tarjeta);
  solicitud.ui.pagando = false;

  if (resultado.ok) {
    solicitud.poliza = generarPoliza();
    solicitud.vigenciaDesde = new Date().toISOString();
    solicitud.errorPago = '';
    irAPaso(PASO.EXITO);
  } else {
    solicitud.errorPago = resultado.motivo;
    irAPaso(PASO.ERROR);
  }
}

export function pintar() {
  const sec = seccion();
  pintarPaso(sec, PASO.PAGO);
  const pagando = solicitud.ui.pagando;
  $('[data-etiqueta-boton]', sec).textContent = pagando ? 'Procesando…' : 'Pagar y contratar';
  $('[data-spinner]', sec).hidden = !pagando;
  $('form', sec).setAttribute('aria-busy', String(pagando));
}
