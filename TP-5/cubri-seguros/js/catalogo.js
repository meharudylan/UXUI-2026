// Carga de planes desde el JSON local.
export async function cargarPlanes() {
  const res = await fetch('data/planes.json');
  if (!res.ok) throw new Error(`No se pudo cargar planes.json (${res.status})`);
  return res.json();
}
