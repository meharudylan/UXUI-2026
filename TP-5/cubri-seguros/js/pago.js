// Pago simulado y número de póliza (sección 5.3). Nunca usar tarjetas reales.
export function simularPago(numero) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const limpio = numero.replace(/\s/g, '');
      resolve(limpio === '4000000000000002'
        ? { ok: false, motivo: 'Tarjeta rechazada' }
        : { ok: true });
    }, 1500);
  });
}

// Arranca en 123 para que la primera póliza sea POL-AAAA-000123 como en el Figma
let contador = 122;
export function generarPoliza() {
  contador += 1;
  return `POL-${new Date().getFullYear()}-${String(contador).padStart(6, '0')}`;
}
