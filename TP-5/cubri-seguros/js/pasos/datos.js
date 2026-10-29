// Pantalla 04 · Datos personales (Paso 3). Validación en línea; "Continuar" se habilita solo si todo es válido.
import { solicitud, irAPaso } from '../estado.js';
import { validarPaso } from '../validaciones.js';
import { PASO } from '../config-pasos.js';
import { $ } from '../dom.js';
import { conectarEnvio, pintarPaso, revelarErrores } from '../componentes/formulario.js';

const seccion = () => $('[data-paso="3"]');

export function iniciar() {
  conectarEnvio(seccion(), () => {
    if (Object.keys(validarPaso(PASO.DATOS, solicitud)).length) return revelarErrores(seccion(), PASO.DATOS);
    irAPaso(PASO.PAGO);
  });
}

export function pintar() {
  pintarPaso(seccion(), PASO.DATOS);
}
