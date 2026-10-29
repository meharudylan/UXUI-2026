// Stepper: recibe el paso actual y pinta 3 estados (completo / activo / pendiente).
import { solicitud } from '../estado.js';
import { ETAPAS } from '../config-pasos.js';
import { $ } from '../dom.js';
import { iconoCheck } from '../iconos.js';

const estadoDe = (paso, actual) => (paso < actual ? 'completo' : paso === actual ? 'activo' : 'pendiente');

const CIRCULO = {
  completo: 'bg-emerald-600 text-white',
  activo: 'bg-indigo-600 text-white',
  pendiente: 'bg-white text-slate-500 border border-slate-300',
};
const ETIQUETA = { completo: 'text-emerald-600', activo: 'text-indigo-600', pendiente: 'text-slate-500' };

export function renderStepper() {
  const lista = $('#stepper');
  if (!lista) return;
  lista.innerHTML = ETAPAS.map((etapa, i) => {
    const estado = estadoDe(etapa.paso, solicitud.paso);
    const ultimo = i === ETAPAS.length - 1;
    const linea = ultimo ? '' : `<span class="mx-2 h-0.5 min-w-3 flex-1 rounded-full ${estado === 'completo' ? 'bg-emerald-600' : 'bg-slate-200'}"></span>`;
    return `
      <li class="flex items-center ${ultimo ? '' : 'flex-1'}" ${estado === 'activo' ? 'aria-current="step"' : ''}>
        <span class="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${CIRCULO[estado]}">
          ${estado === 'completo' ? iconoCheck() : etapa.paso}
        </span>
        <span class="ml-2 text-[13px] font-semibold ${ETIQUETA[estado]}">${etapa.etiqueta}</span>
        ${linea}
      </li>`;
  }).join('');
}
