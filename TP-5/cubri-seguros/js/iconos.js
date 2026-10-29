// Iconos SVG inline (estilo Lucide) usados desde JS.
const base = (c, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${c}</svg>`;

export const iconoCheck = (clase = 'size-3.5') => base('<path d="M20 6 9 17l-5-5"/>', `class="${clase}"`);
export const iconoX = (clase = 'size-3.5') => base('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', `class="${clase}"`);
