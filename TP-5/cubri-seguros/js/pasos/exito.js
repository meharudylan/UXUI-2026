// Pantalla 06 · Éxito. Todo sale del estado.
import { solicitud, reiniciar } from '../estado.js';
import { obtenerPlan, cuotaDelPlan } from '../cotizador.js';
import { formatearMoneda, formatearFecha } from '../formato.js';
import { $, setTexto } from '../dom.js';

const seccion = () => $('[data-paso="5"]');

export function iniciar() {
  const sec = seccion();
  $('[data-accion="descargar-poliza"]', sec).addEventListener('click', descargarPoliza);
  $('[data-accion="volver-inicio"]', sec).addEventListener('click', reiniciar);
}

function detalle() {
  const s = solicitud;
  const plan = obtenerPlan(s);
  return {
    nombre: s.titular.nombre.trim(),
    email: s.titular.email.trim(),
    poliza: s.poliza ?? '',
    plan: plan?.nombre ?? '',
    equipo: `${s.equipo.marca} ${s.equipo.modelo.trim()}`.trim(),
    vigencia: s.vigenciaDesde ? formatearFecha(new Date(s.vigenciaDesde)) : '',
    cuota: plan ? formatearMoneda(cuotaDelPlan(s, plan)) : '',
  };
}

function descargarPoliza() {
  const d = detalle();
  const texto = [
    `Póliza ${d.poliza}`, `Titular: ${d.nombre} ${solicitud.titular.apellido.trim()}`, `Email: ${d.email}`,
    `Equipo: ${d.equipo}`, `Plan: ${d.plan}`, `Vigencia desde: ${d.vigencia}`, `Cuota mensual: ${d.cuota}`,
    '', 'Documento de práctica: simulación sin valor legal.',
  ].join('\n');
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(new Blob([texto], { type: 'text/plain;charset=utf-8' }));
  enlace.download = `${d.poliza}.txt`;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}

export function pintar() {
  const sec = seccion();
  Object.entries(detalle()).forEach(([clave, valor]) => setTexto(sec, clave, valor));
}
