// Pantalla 07 · Error de pago. Los datos cargados se conservan.
import { solicitud, irAPaso } from '../estado.js';
import { PASO } from '../config-pasos.js';
import { $, setTexto } from '../dom.js';

const seccion = () => $('[data-paso="6"]');

export function iniciar() {
  const sec = seccion();
  $('[data-accion="reintentar"]', sec).addEventListener('click', () => irAPaso(PASO.PAGO));
  $('[data-accion="cambiar-medio"]', sec).addEventListener('click', () => {
    irAPaso(PASO.PAGO);
    $('input[name="metodo"]:checked', $('[data-paso="4"]'))?.focus();
  });
}

export function pintar() {
  setTexto(seccion(), 'motivo', solicitud.errorPago || 'Tarjeta rechazada');
}
