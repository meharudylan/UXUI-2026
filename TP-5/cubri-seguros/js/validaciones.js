// Validaciones (sección 5.2). Cada función recibe un valor y devuelve
// un mensaje de error o null. No tocan el DOM ni el estado.

const limpiar = (s) => String(s ?? '').trim();

export const validarMarca = (v) => (v ? null : 'Elegí una marca');

export function validarModelo(v) {
  const n = limpiar(v).length;
  return n >= 2 && n <= 40 ? null : 'Ingresá el modelo del equipo';
}

export function validarValor(v) {
  return Number.isFinite(v) && v >= 100000 && v <= 2500000
    ? null
    : 'El valor debe estar entre $100.000 y $2.500.000';
}

export const validarAntiguedad = (v) => (v ? null : 'Indicá la antigüedad');
export const validarPlan = (v) => (v ? null : 'Elegí un plan');

const letras = (s) => limpiar(s).replace(/[^\p{L}]/gu, '').length;
export const validarNombre = (v) => (letras(v) >= 2 ? null : 'Ingresá tu nombre');
export const validarApellido = (v) => (letras(v) >= 2 ? null : 'Ingresá tu apellido');

export const validarDni = (v) => (/^\d{7,8}$/.test(String(v ?? '')) ? null : 'El DNI debe tener 7 u 8 números');

// Recibe "AAAA-MM-DD" (lo que devuelve <input type="date">)
export function validarNacimiento(iso, hoy = new Date()) {
  const msg = 'Tenés que ser mayor de edad';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ''));
  if (!m) return msg;
  const [anio, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const f = new Date(anio, mes - 1, dia);
  if (f.getFullYear() !== anio || f.getMonth() !== mes - 1 || f.getDate() !== dia) return msg;
  let edad = hoy.getFullYear() - anio;
  if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) edad -= 1;
  return edad >= 18 ? null : msg;
}

export const validarEmail = (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpiar(v)) ? null : 'Ingresá un email válido');

// 10 dígitos, sin 0 ni 15 al inicio; se ignoran espacios y guiones
export function validarCelular(v) {
  const n = String(v ?? '').replace(/[\s-]/g, '');
  const ok = /^\d{10}$/.test(n) && !n.startsWith('0') && !n.startsWith('15');
  return ok ? null : 'Ej.: 11 5555-1234';
}

export const validarTerminos = (v) => (v === true ? null : 'Tenés que aceptar los términos');

export const validarTarjeta = (v) => (/^\d{16}$/.test(String(v ?? '').replace(/\s/g, '')) ? null : 'Número de tarjeta inválido');

// MM/AA, mes 01-12, vigente hasta fin del mes indicado
export function validarVencimiento(v, hoy = new Date()) {
  const msg = 'Vencimiento inválido';
  const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(String(v ?? ''));
  if (!m) return msg;
  const anio = 2000 + Number(m[2]);
  const mes = Number(m[1]);
  const vigente = anio > hoy.getFullYear() || (anio === hoy.getFullYear() && mes >= hoy.getMonth() + 1);
  return vigente ? null : msg;
}

export const validarCvv = (v) => (/^\d{3}$/.test(String(v ?? '')) ? null : 'CVV inválido');
export const validarTitularTarjeta = (v) => (limpiar(v) ? null : 'Ingresá el nombre del titular');

// Ruta del campo en el estado -> su validador
export const VALIDADORES = {
  'equipo.marca': validarMarca,
  'equipo.modelo': validarModelo,
  'equipo.valor': validarValor,
  'equipo.antiguedad': validarAntiguedad,
  plan: validarPlan,
  'titular.nombre': validarNombre,
  'titular.apellido': validarApellido,
  'titular.dni': validarDni,
  'titular.nacimiento': validarNacimiento,
  'titular.email': validarEmail,
  'titular.celular': validarCelular,
  'titular.terminos': validarTerminos,
  'pago.tarjeta': validarTarjeta,
  'pago.titular': validarTitularTarjeta,
  'pago.vencimiento': validarVencimiento,
  'pago.cvv': validarCvv,
};

// Campos de cada paso, en el orden en que aparecen en pantalla
export const CAMPOS_POR_PASO = {
  1: ['equipo.marca', 'equipo.modelo', 'equipo.valor', 'equipo.antiguedad'],
  2: ['plan'],
  3: ['titular.nombre', 'titular.apellido', 'titular.dni', 'titular.nacimiento', 'titular.email', 'titular.celular', 'titular.terminos'],
  4: ['pago.tarjeta', 'pago.titular', 'pago.vencimiento', 'pago.cvv'],
};

const leer = (obj, ruta) => ruta.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

// Devuelve { ruta: mensaje } solo con los campos inválidos del paso
export function validarPaso(paso, datos) {
  const errores = {};
  for (const ruta of CAMPOS_POR_PASO[paso] ?? []) {
    const error = VALIDADORES[ruta](leer(datos, ruta));
    if (error) errores[ruta] = error;
  }
  return errores;
}
