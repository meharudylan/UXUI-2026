// Pantalla 01 · Inicio / Catálogo. Solo "Celular" está habilitado.
import { irAPaso } from '../estado.js';
import { PASO } from '../config-pasos.js';
import { $ } from '../dom.js';

const seccion = () => $('[data-paso="0"]');

export function iniciar() {
  $('[data-accion="cotizar"]', seccion())?.addEventListener('click', () => irAPaso(PASO.COTIZAR));
  $('[data-producto="celular"]', seccion())?.addEventListener('click', () => irAPaso(PASO.COTIZAR));
}

export function pintar() {}
