// Cálculo de la cuota (sección 5.1). Es la ÚNICA función que calcula precios.
export const FACTORES_ANTIGUEDAD = { menos1: 1.0, '1a2': 1.1, mas2: 1.25 };

export function calcularCuota(valor, tasaAnual, antiguedad) {
  const factor = FACTORES_ANTIGUEDAD[antiguedad];
  return Math.round((valor * tasaAnual) / 12 * factor);
}

export const obtenerPlan = (solicitud) => solicitud.planes.find((p) => p.id === solicitud.plan) ?? null;

export const cuotaDelPlan = (solicitud, plan) =>
  calcularCuota(solicitud.equipo.valor, plan.tasaAnual, solicitud.equipo.antiguedad);
