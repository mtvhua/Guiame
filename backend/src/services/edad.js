'use strict';

// Se guarda la fecha de nacimiento y la edad se calcula al consultar, así nunca queda desactualizada.
// Fragmento SQL para usar dentro de un SELECT / RETURNING sobre la tabla usuarios.
const EDAD_SQL = "date_part('year', age(fecha_nacimiento))::int AS edad";

const FECHA_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Valida una fecha "AAAA-MM-DD": que exista (no 31 de febrero), que no sea futura
 * y que la edad resultante esté entre 10 y 110 años. Devuelve la fecha normalizada o null.
 */
function validarFechaNacimiento(valor, hoy = new Date()) {
  if (typeof valor !== 'string') return null;
  const m = FECHA_RE.exec(valor.trim());
  if (!m) return null;
  const anio = Number(m[1]);
  const mes = Number(m[2]);
  const dia = Number(m[3]);

  const f = new Date(Date.UTC(anio, mes - 1, dia));
  if (f.getUTCFullYear() !== anio || f.getUTCMonth() !== mes - 1 || f.getUTCDate() !== dia) return null;

  let edad = hoy.getUTCFullYear() - anio;
  const antesDelCumple = hoy.getUTCMonth() + 1 < mes || (hoy.getUTCMonth() + 1 === mes && hoy.getUTCDate() < dia);
  if (antesDelCumple) edad -= 1;
  if (edad < 10 || edad > 110) return null;

  return `${m[1]}-${m[2]}-${m[3]}`;
}

module.exports = { EDAD_SQL, validarFechaNacimiento };
