// Números de paso y textos de cada etapa del checkout.
export const PASO = { INICIO: 0, COTIZAR: 1, PLAN: 2, DATOS: 3, PAGO: 4, EXITO: 5, ERROR: 6 };

// Etapas que muestra el stepper (pasos 1 a 4)
export const ETAPAS = [
  { paso: 1, etiqueta: 'Cotizar', tituloBarra: 'Cotizá tu seguro', titulo: 'Contanos sobre tu celular' },
  { paso: 2, etiqueta: 'Plan',    tituloBarra: 'Elegí tu plan',    titulo: 'Elegí tu plan' },
  { paso: 3, etiqueta: 'Datos',   tituloBarra: 'Tus datos',        titulo: 'Tus datos' },
  { paso: 4, etiqueta: 'Pago',    tituloBarra: 'Pago',             titulo: 'Pago' },
];
