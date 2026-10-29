// Arranque, eventos globales y navegación.
import { solicitud, irAPaso, reiniciar, alCambiar } from './estado.js';
import { PASO } from './config-pasos.js';
import { conectarFormularios } from './componentes/formulario.js';
import { render, PANTALLAS } from './render.js';

function conectarNavegacion() {
  document.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-accion]');
    if (!boton) return;
    if (boton.dataset.accion === 'volver') {
      // "Volver" no borra nada: el estado se conserva y render() rellena los campos
      const destino = solicitud.paso === PASO.ERROR ? PASO.PAGO : solicitud.paso - 1;
      if (destino >= PASO.INICIO) irAPaso(destino);
    }
    if (boton.dataset.accion === 'ir-inicio') {
      if (solicitud.paso >= PASO.EXITO) reiniciar();
      else irAPaso(PASO.INICIO);
    }
  });
}

function main() {
  Object.values(PANTALLAS).forEach((pantalla) => pantalla.iniciar());
  conectarFormularios();
  conectarNavegacion();
  alCambiar(render);
  render();
}

main();
