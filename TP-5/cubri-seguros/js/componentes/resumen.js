// Resumen de la solicitud. Se genera UNA sola vez desde el estado (regla de oro, sección 8):
// el mismo markup sirve para la card lateral (desktop), el bloque de Pago (mobile)
// y la barra del paso Plan (mobile).
import { solicitud } from '../estado.js';
import { obtenerPlan, cuotaDelPlan } from '../cotizador.js';
import { formatearMoneda } from '../formato.js';
import { $, $$ } from '../dom.js';

function fila(raiz, nombre, texto, visible) {
  const el = $(`[data-fila="${nombre}"]`, raiz);
  if (!el) return;
  el.hidden = !visible;
  const valor = $('[data-valor]', el);
  if (valor) valor.textContent = texto ?? '';
}

export function renderResumen() {
  const s = solicitud;
  const plan = s.paso >= 2 ? obtenerPlan(s) : null;
  const cuota = plan ? cuotaDelPlan(s, plan) : null;
  const equipo = [s.equipo.marca, s.equipo.modelo.trim()].filter(Boolean).join(' ');
  const titular = [s.titular.nombre.trim(), s.titular.apellido.trim()].filter(Boolean).join(' ');

  const card = $('#resumen');
  if (card) {
    fila(card, 'seguro', 'Celular', true);
    fila(card, 'equipo', equipo, Boolean(equipo));
    fila(card, 'valor', s.equipo.valor ? formatearMoneda(s.equipo.valor) : '', s.paso === 1 && s.equipo.valor > 0);
    fila(card, 'plan', plan?.nombre, Boolean(plan));
    fila(card, 'titular', titular, s.paso >= 4 && Boolean(titular));
    fila(card, 'total', cuota != null ? formatearMoneda(cuota) : '', cuota != null);
    const aviso = $('[data-resumen-aviso]', card);
    if (aviso) aviso.hidden = s.paso !== 1;
  }

  // Barra compacta del paso Plan (mobile)
  $$('[data-resumen="linea"]').forEach((el) => { el.textContent = plan ? `Plan ${plan.nombre} · ${s.equipo.modelo.trim()}` : ''; });
  $$('[data-resumen="cuota"]').forEach((el) => { el.textContent = cuota != null ? `${formatearMoneda(cuota)}/mes` : ''; });
}
