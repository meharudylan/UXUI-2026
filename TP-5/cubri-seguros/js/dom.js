// Helpers mínimos de DOM.
export const $ = (selector, raiz = document) => raiz.querySelector(selector);
export const $$ = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];

// Escribe el valor en un input sin pisar lo que la persona está tecleando
export function setValor(el, valor) {
  const texto = String(valor ?? '');
  if (el && document.activeElement !== el && el.value !== texto) el.value = texto;
}

export function setTexto(raiz, clave, texto) {
  $$(`[data-bind="${clave}"]`, raiz).forEach((el) => { el.textContent = texto; });
}
