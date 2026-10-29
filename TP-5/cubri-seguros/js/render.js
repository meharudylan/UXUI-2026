// render(): pinta la pantalla a partir del estado. Se llama siempre después de cambiarlo.
import { solicitud } from './estado.js';
import { ETAPAS } from './config-pasos.js';
import { $, $$ } from './dom.js';
import { renderStepper } from './componentes/stepper.js';
import { renderResumen } from './componentes/resumen.js';
import * as inicio from './pasos/inicio.js';
import * as cotizar from './pasos/cotizar.js';
import * as planes from './pasos/planes.js';
import * as datos from './pasos/datos.js';
import * as pagoPaso from './pasos/paso-pago.js';
import * as exito from './pasos/exito.js';
import * as error from './pasos/error.js';

// Un módulo por pantalla: para tocar el pago -> pasos/paso-pago.js + partials/05-pago.html
export const PANTALLAS = { 0: inicio, 1: cotizar, 2: planes, 3: datos, 4: pagoPaso, 5: exito, 6: error };

export function render() {
  const { paso } = solicitud;
  document.body.dataset.pasoActual = paso; // lo usa layout.css

  $$('section[data-paso]').forEach((s) => { s.hidden = Number(s.dataset.paso) !== paso; });
  $('#checkout').hidden = paso < 1 || paso > 4;

  const etapa = ETAPAS.find((e) => e.paso === paso);
  if (etapa) {
    $('[data-titulo="barra"]').textContent = etapa.tituloBarra;
    $('[data-titulo="h1"]').textContent = etapa.titulo;
  }

  renderStepper();
  renderResumen();
  PANTALLAS[paso].pintar();
}
