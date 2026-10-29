// Pantalla 02 · Cotizar (Paso 1): datos del equipo -> carga planes.json -> Paso 2.
import { solicitud, irAPaso, notificar } from '../estado.js';
import { validarPaso } from '../validaciones.js';
import { cargarPlanes } from '../catalogo.js';
import { PASO } from '../config-pasos.js';
import { $ } from '../dom.js';
import { conectarEnvio, pintarPaso, revelarErrores } from '../componentes/formulario.js';

const seccion = () => $('[data-paso="1"]');

export function iniciar() {
  conectarEnvio(seccion(), verPlanes);
}

async function verPlanes() {
  if (Object.keys(validarPaso(PASO.COTIZAR, solicitud)).length) return revelarErrores(seccion(), PASO.COTIZAR);
  if (solicitud.ui.cargando) return;
  if (!solicitud.planes.length) {
    solicitud.ui.cargando = true;
    solicitud.ui.errorCarga = '';
    notificar();
    try {
      solicitud.planes = await cargarPlanes();
    } catch (error) {
      console.error(error);
      solicitud.ui.errorCarga = 'No pudimos cargar los planes. Si abriste el archivo con doble click, usá Live Server o "npx serve".';
    }
    solicitud.ui.cargando = false;
  }
  if (solicitud.planes.length) irAPaso(PASO.PLAN);
  else notificar();
}

export function pintar() {
  const sec = seccion();
  pintarPaso(sec, PASO.COTIZAR);
  $('[data-etiqueta-boton]', sec).textContent = solicitud.ui.cargando ? 'Cargando planes…' : 'Ver planes';
  const error = $('[data-error-carga]', sec);
  error.textContent = solicitud.ui.errorCarga;
  error.hidden = !solicitud.ui.errorCarga;
}
