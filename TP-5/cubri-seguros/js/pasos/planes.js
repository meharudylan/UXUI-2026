// Pantalla 03 · Elegir plan (Paso 2). Las cuotas salen de calcularCuota() con el estado.
import { solicitud, irAPaso } from '../estado.js';
import { cuotaDelPlan } from '../cotizador.js';
import { formatearMoneda } from '../formato.js';
import { PASO } from '../config-pasos.js';
import { $, $$ } from '../dom.js';
import { iconoCheck, iconoX } from '../iconos.js';
import { conectarEnvio, pintarPaso } from '../componentes/formulario.js';

const seccion = () => $('[data-paso="2"]');

export function iniciar() {
  conectarEnvio(seccion(), () => irAPaso(PASO.DATOS));
}

// Coberturas incluidas (✓) y, como incentivo, las que agrega el plan siguiente (✗)
function coberturasHtml(planes, i) {
  const propias = planes[i].coberturas;
  const faltan = (planes[i + 1]?.coberturas ?? []).filter((c) => !propias.includes(c));
  const item = (texto, incluida) => `
    <li class="flex items-center gap-2 text-[13px] ${incluida ? 'text-slate-900' : 'text-slate-400'}">
      <span class="${incluida ? 'text-emerald-600' : 'text-slate-400'}">${incluida ? iconoCheck('size-3.5') : iconoX('size-3.5')}</span>${texto}
    </li>`;
  return propias.map((c) => item(c, true)).join('') + faltan.map((c) => item(c, false)).join('');
}

// Las cards se crean una sola vez desde el <template>; después solo se actualizan
function construirTarjetas(lista) {
  const molde = $('#tpl-plan', seccion());
  solicitud.planes.forEach((plan, i) => {
    const nodo = molde.content.cloneNode(true);
    const raiz = nodo.firstElementChild;
    raiz.dataset.plan = plan.id;
    $('input', raiz).value = plan.id;
    $('[data-nombre]', raiz).textContent = plan.nombre;
    $('[data-badge]', raiz).hidden = !plan.recomendado;
    $('[data-coberturas]', raiz).innerHTML = coberturasHtml(solicitud.planes, i);
    lista.appendChild(nodo);
  });
}

export function pintar() {
  const lista = $('#lista-planes', seccion());
  if (!lista.children.length && solicitud.planes.length) construirTarjetas(lista);
  solicitud.planes.forEach((plan) => {
    const card = $(`[data-plan="${plan.id}"]`, lista);
    if (card) $('[data-precio]', card).textContent = formatearMoneda(cuotaDelPlan(solicitud, plan));
  });
  pintarPaso(seccion(), PASO.PLAN);
}
