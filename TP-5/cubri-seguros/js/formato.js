// Formateo de números, moneda y fechas (es-AR). Funciones puras.
const moneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const miles = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });
const fecha = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const formatearMoneda = (n) => moneda.format(n);
export const formatearMiles = (n) => miles.format(n);
export const formatearFecha = (d) => fecha.format(d);
export const soloDigitos = (s) => String(s ?? '').replace(/\D/g, '');

// "4111111111111111" -> "4111 1111 1111 1111"
export function formatearTarjeta(s) {
  return soloDigitos(s).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}

// "1228" -> "12/28"
export function formatearVencimiento(s) {
  const d = soloDigitos(s).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
