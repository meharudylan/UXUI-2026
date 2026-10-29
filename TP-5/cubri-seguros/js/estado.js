// Único objeto de estado de toda la solicitud (sección 6.2).
// Todo cambio pasa por acá y termina en notificar() -> render().
const estadoInicial = () => ({
  paso: 0, // 0 = inicio, 1..4 = checkout, 5 = éxito, 6 = error
  equipo: { marca: '', modelo: '', valor: 0, antiguedad: '' },
  plan: 'plus',
  titular: { nombre: '', apellido: '', dni: '', nacimiento: '', email: '', celular: '', terminos: false },
  pago: { metodo: 'credito', tarjeta: '', vencimiento: '', cvv: '', titular: '' },
  poliza: null,
  vigenciaDesde: null, // fecha de emisión de la póliza
  errorPago: '',       // motivo del rechazo
  planes: [],          // se cargan de data/planes.json
  ui: { tocados: {}, intentos: {}, pagando: false, cargando: false, errorCarga: '' },
});

export const solicitud = estadoInicial();

const oyentes = [];
export const alCambiar = (fn) => oyentes.push(fn);
export const notificar = () => oyentes.forEach((fn) => fn());

export function irAPaso(n) {
  solicitud.paso = n;
  notificar(); // siempre después de cambiar el estado
  window.scrollTo({ top: 0 });
}

export function reiniciar() {
  const planes = solicitud.planes; // el catálogo no se vuelve a pedir
  Object.assign(solicitud, estadoInicial(), { planes });
  notificar();
}

// Acceso por ruta: obtener('equipo.marca')
export const obtener = (ruta) => ruta.split('.').reduce((o, k) => o[k], solicitud);

export function establecer(ruta, valor) {
  const partes = ruta.split('.');
  const ultima = partes.pop();
  const destino = partes.reduce((o, k) => o[k], solicitud);
  if (destino[ultima] === valor) return;
  destino[ultima] = valor;
  notificar();
}

export function marcarTocado(ruta) {
  if (solicitud.ui.tocados[ruta]) return;
  solicitud.ui.tocados[ruta] = true;
  notificar();
}

export function marcarIntento(paso) {
  solicitud.ui.intentos[paso] = true;
  notificar();
}
