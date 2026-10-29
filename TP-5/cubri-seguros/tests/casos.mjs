// Casos de prueba de la lógica pura (sin navegador). Ejecutar: node tests/casos.mjs
import assert from 'node:assert/strict';
import { calcularCuota } from '../js/cotizador.js';
import * as v from '../js/validaciones.js';
import { simularPago, generarPoliza } from '../js/pago.js';
import { formatearMoneda, formatearTarjeta, formatearVencimiento } from '../js/formato.js';
import { readFileSync } from 'node:fs';

const planes = JSON.parse(readFileSync(new URL('../data/planes.json', import.meta.url)));
const cuotas = (valor, antig) => planes.map((p) => calcularCuota(valor, p.tasaAnual, antig));
let n = 0;
const ok = async (nombre, fn) => { await fn(); n += 1; console.log('  ✓', nombre); };

console.log('Cuotas (sección 5.1)');
await ok('$600.000 · menos de 1 año', () => assert.deepEqual(cuotas(600000, 'menos1'), [2000, 3000, 4500]));
await ok('$600.000 · 1 a 2 años',     () => assert.deepEqual(cuotas(600000, '1a2'), [2200, 3300, 4950]));
await ok('$1.200.000 · más de 2 años', () => assert.deepEqual(cuotas(1200000, 'mas2'), [5000, 7500, 11250]));

console.log('Validaciones (sección 5.2)');
await ok('marca', () => { assert.equal(v.validarMarca(''), 'Elegí una marca'); assert.equal(v.validarMarca('Apple'), null); });
await ok('modelo 2 a 40', () => { assert.ok(v.validarModelo('A')); assert.equal(v.validarModelo('A55'), null); assert.ok(v.validarModelo('x'.repeat(41))); });
await ok('valor 100.000 a 2.500.000', () => { assert.ok(v.validarValor(99999)); assert.equal(v.validarValor(100000), null); assert.equal(v.validarValor(2500000), null); assert.ok(v.validarValor(2500001)); assert.ok(v.validarValor(NaN)); });
await ok('nombre/apellido', () => { assert.ok(v.validarNombre('J')); assert.equal(v.validarNombre('Juan'), null); assert.ok(v.validarApellido('  1 ')); });
await ok('DNI 7 u 8 dígitos', () => { assert.ok(v.validarDni('123456')); assert.equal(v.validarDni('1234567'), null); assert.equal(v.validarDni('30123456'), null); assert.ok(v.validarDni('301234567')); });
await ok('mayor de 18', () => {
  const hoy = new Date(2026, 9, 28);
  assert.equal(v.validarNacimiento('2008-10-28', hoy), null);
  assert.ok(v.validarNacimiento('2008-10-29', hoy));
  assert.ok(v.validarNacimiento('', hoy));
  assert.equal(v.validarNacimiento('1990-05-10', hoy), null);
});
await ok('email', () => { assert.ok(v.validarEmail('juan.perez@')); assert.equal(v.validarEmail('juan@mail.com'), null); });
await ok('celular', () => {
  assert.equal(v.validarCelular('11 5555-1234'), null);
  assert.ok(v.validarCelular('011 5555-1234'));
  assert.ok(v.validarCelular('15 5555-1234'));
  assert.ok(v.validarCelular('5555-1234'));
});
await ok('términos', () => { assert.ok(v.validarTerminos(false)); assert.equal(v.validarTerminos(true), null); });
await ok('tarjeta 16 dígitos', () => { assert.equal(v.validarTarjeta('4111 1111 1111 1111'), null); assert.ok(v.validarTarjeta('4111 1111')); });
await ok('vencimiento', () => {
  const hoy = new Date(2026, 9, 28);
  assert.equal(v.validarVencimiento('12/28', hoy), null);
  assert.ok(v.validarVencimiento('09/26', hoy));
  assert.ok(v.validarVencimiento('13/28', hoy));
  assert.ok(v.validarVencimiento('1228', hoy));
});
await ok('CVV y titular', () => { assert.equal(v.validarCvv('123'), null); assert.ok(v.validarCvv('12')); assert.ok(v.validarTitularTarjeta('  ')); });
await ok('validarPaso devuelve solo inválidos, en orden', () => {
  const datos = { equipo: { marca: '', modelo: 'A55', valor: 600000, antiguedad: '' } };
  assert.deepEqual(Object.keys(v.validarPaso(1, datos)), ['equipo.marca', 'equipo.antiguedad']);
});

console.log('Pago simulado (sección 5.3)');
await ok('4111… aprobado', async () => assert.deepEqual(await simularPago('4111 1111 1111 1111'), { ok: true }));
await ok('4000… rechazado', async () => assert.deepEqual(await simularPago('4000 0000 0000 0002'), { ok: false, motivo: 'Tarjeta rechazada' }));
await ok('póliza POL-AAAA-NNNNNN', () => assert.match(generarPoliza(), /^POL-\d{4}-\d{6}$/));

console.log('Formato');
await ok('moneda es-AR', () => assert.equal(formatearMoneda(3000).replace(/\s/g, ' '), '$ 3.000'));
await ok('máscaras', () => { assert.equal(formatearTarjeta('4111111111111111'), '4111 1111 1111 1111'); assert.equal(formatearVencimiento('1228'), '12/28'); });

// Resultados de los tests async
const a = await simularPago('4111 1111 1111 1111');
const b = await simularPago('4000 0000 0000 0002');
assert.equal(a.ok, true); assert.equal(b.ok, false);
console.log(`\n${n} grupos OK · pagos simulados verificados`);
