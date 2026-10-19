'use strict';

// Prueba el API completo contra un PostgreSQL REAL (Vertex AI y Cloud Storage se simulan).
// Uso:  DB_HOST=127.0.0.1 DB_PORT=5432 DB_USER=app DB_NAME=guiame_test DB_PASS=... npm test
// ¡Usa una base de pruebas, nunca la de producción! Borra los datos de las tablas al iniciar.

process.env.JWT_SECRET = process.env.JWT_SECRET || 'x'.repeat(40);
process.env.DB_PASS = process.env.DB_PASS || 'testpass';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// --- Falso Cloud Storage: existen solo estos archivos ---
const ARCHIVOS = new Set(['pasos/paso1.gif', 'info/que_es.jpg']);
const storagePath = require.resolve('@google-cloud/storage');
require.cache[storagePath] = {
  id: storagePath, filename: storagePath, loaded: true,
  exports: {
    Storage: class {
      bucket(nombre) {
        return {
          file: (ruta) => ({
            exists: async () => [ARCHIVOS.has(ruta)],
            getSignedUrl: async (op) => [`https://storage.googleapis.com/${nombre}/${ruta}?X-Goog-Signature=falsa&exp=${op.expires}`]
          })
        };
      }
    }
  }
};

const { crearApp } = require('../src/app');
const { getPool } = require('../src/db/pool');
const vertex = require('../src/services/vertex');

let server;
let base;
const llamadas = []; // lo que se le "mandó" a Vertex

async function http(metodo, ruta, { body, token, redirect = 'manual' } = {}) {
  const res = await fetch(base + ruta, {
    method: metodo,
    redirect,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  const texto = await res.text();
  let json = null;
  try { json = texto ? JSON.parse(texto) : null; } catch (e) { /* las redirecciones traen texto plano */ }
  return { status: res.status, headers: res.headers, json };
}

// Edad esperada de una fecha 'AAAA-MM-DD' (independiente de cuándo se corra la prueba)
function edadDe(fecha) {
  const [a, m, d] = fecha.split('-').map(Number);
  const hoy = new Date();
  let edad = hoy.getUTCFullYear() - a;
  if (hoy.getUTCMonth() + 1 < m || (hoy.getUTCMonth() + 1 === m && hoy.getUTCDate() < d)) edad -= 1;
  return edad;
}

const RESP_SIN_CAMBIOS = [1, 2, 3, 4, 5, 6, 7].map((paso) => ({ paso, respuesta: 'no' }));
const RESP_CON_CAMBIOS = RESP_SIN_CAMBIOS.map((r) => (r.paso === 5 ? { paso: 5, respuesta: 'si' } : r));

before(async () => {
  const schema = fs.readFileSync(path.join(__dirname, '../src/db/schema.sql'), 'utf8');
  await getPool().query(schema);
  // ejecutar dos veces comprueba que el esquema es idempotente
  await getPool().query(schema);
  await getPool().query('TRUNCATE usuarios CASCADE');

  vertex.generarReporte = async (datos) => { llamadas.push(datos); return 'Reporte simulado de Vertex AI.'; };
  server = crearApp().listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  server.close();
  await getPool().end();
});

test('health y health/db', async () => {
  assert.deepEqual((await http('GET', '/health')).json, { status: 'ok' });
  const db = await http('GET', '/health/db');
  assert.equal(db.status, 200);
  assert.equal(db.json.db, 'ok');
});

test('registro: validaciones', async () => {
  const ok = { nombre: 'Ana López', fechaNacimiento: '1990-05-15', email: 'ana@correo.com', password: 'secreta123' };
  for (const [campo, valor, error] of [
    ['email', 'no-es-correo', 'correo_invalido'],
    ['password', 'corta', 'contrasena_invalida'],
    ['fechaNacimiento', '2020-01-01', 'fecha_nacimiento_invalida'],   // muy joven
    ['fechaNacimiento', '1800-01-01', 'fecha_nacimiento_invalida'],   // muy mayor
    ['fechaNacimiento', '2090-01-01', 'fecha_nacimiento_invalida'],   // futura
    ['fechaNacimiento', '1990-02-31', 'fecha_nacimiento_invalida'],   // no existe
    ['fechaNacimiento', 'abc', 'fecha_nacimiento_invalida'],
    ['fechaNacimiento', undefined, 'fecha_nacimiento_invalida'],
    ['nombre', '   ', 'nombre_invalido']
  ]) {
    const r = await http('POST', '/api/auth/register', { body: { ...ok, [campo]: valor } });
    assert.equal(r.status, 400, campo);
    assert.equal(r.json.error, error, campo);
  }
});

let ana;   // sesión de Ana
test('registro correcto, correo repetido (sin importar mayúsculas) y login', async () => {
  const r = await http('POST', '/api/auth/register', {
    body: { nombre: 'Ana López', fechaNacimiento: '1990-05-15', email: 'Ana@Correo.com', password: 'secreta123' }
  });
  assert.equal(r.status, 201);
  assert.ok(r.json.accessToken && r.json.refreshToken);
  assert.deepEqual(Object.keys(r.json.usuario).sort(), ['edad', 'email', 'id', 'nombre']);
  assert.equal(r.json.usuario.email, 'ana@correo.com');
  assert.equal(r.json.usuario.edad, edadDe('1990-05-15'));
  assert.ok(!JSON.stringify(r.json).includes('password'));
  ana = r.json;

  const dup = await http('POST', '/api/auth/register', {
    body: { nombre: 'Otra', fechaNacimiento: '1990-05-15', email: 'ANA@correo.com', password: 'otra-clave-1' }
  });
  assert.equal(dup.status, 409);
  assert.equal(dup.json.error, 'correo_en_uso');

  const login = await http('POST', '/api/auth/login', { body: { email: ' ANA@correo.com ', password: 'secreta123' } });
  assert.equal(login.status, 200);
  assert.equal(login.json.usuario.id, ana.usuario.id);

  assert.equal((await http('POST', '/api/auth/login', { body: { email: 'ana@correo.com', password: 'mala' } })).status, 401);
  assert.equal((await http('POST', '/api/auth/login', { body: { email: 'nadie@correo.com', password: 'secreta123' } })).status, 401);
  assert.equal((await http('POST', '/api/auth/login', { body: { email: '', password: '' } })).status, 400);
});

test('la contraseña se guarda como hash bcrypt, y el refresh token como SHA-256', async () => {
  const { rows } = await getPool().query("SELECT password_hash FROM usuarios WHERE email = 'ana@correo.com'");
  assert.match(rows[0].password_hash, /^\$2[aby]\$/);
  const { rows: rt } = await getPool().query('SELECT token_hash FROM refresh_tokens WHERE usuario_id = $1', [ana.usuario.id]);
  assert.ok(rt.length >= 1);
  assert.ok(rt.every((r) => r.token_hash.length === 64 && r.token_hash !== ana.refreshToken));
});

test('GET /usuarios/me exige sesión válida', async () => {
  const r = await http('GET', '/api/usuarios/me', { token: ana.accessToken });
  assert.equal(r.status, 200);
  assert.equal(r.json.nombre, 'Ana López');
  assert.equal((await http('GET', '/api/usuarios/me')).status, 401);
  assert.equal((await http('GET', '/api/usuarios/me', { token: 'basura.basura.basura' })).status, 401);
});

test('autoexamen como invitada: devuelve reporte pero no guarda', async () => {
  llamadas.length = 0;
  const r = await http('POST', '/api/examenes', { body: { idioma: 'es', respuestas: RESP_CON_CAMBIOS } });
  assert.equal(r.status, 200);
  assert.equal(r.json.guardado, false);
  assert.equal(r.json.tieneAlertas, true);
  assert.equal(r.json.reporte, 'Reporte simulado de Vertex AI.');
  assert.equal(llamadas[0].nombre, null);   // sin sesión no se manda nombre ni edad
  const { rows } = await getPool().query('SELECT count(*)::int AS n FROM autoexamenes');
  assert.equal(rows[0].n, 0);
});

test('autoexamen: validación de respuestas', async () => {
  const malos = [
    undefined,
    [],
    RESP_SIN_CAMBIOS.slice(0, 6),
    [...RESP_SIN_CAMBIOS.slice(0, 6), { paso: 7, respuesta: 'quizas' }],
    [...RESP_SIN_CAMBIOS.slice(0, 6), { paso: 6, respuesta: 'no' }],   // paso repetido
    [...RESP_SIN_CAMBIOS.slice(0, 6), { paso: 8, respuesta: 'no' }]
  ];
  for (const respuestas of malos) {
    const r = await http('POST', '/api/examenes', { token: ana.accessToken, body: { idioma: 'es', respuestas } });
    assert.equal(r.status, 400, JSON.stringify(respuestas)?.slice(0, 60));
    assert.equal(r.json.error, 'respuestas_invalidas');
  }
  assert.equal((await http('POST', '/api/examenes', { token: 'mal.token.aqui', body: { respuestas: RESP_SIN_CAMBIOS } })).status, 401);
});

test('autoexamen con sesión: guarda examen y 7 respuestas, y manda nombre y edad a Vertex', async () => {
  llamadas.length = 0;
  const r = await http('POST', '/api/examenes', { token: ana.accessToken, body: { idioma: 'quc', respuestas: RESP_CON_CAMBIOS } });
  assert.equal(r.status, 200);
  assert.equal(r.json.guardado, true);
  assert.equal(r.json.tieneAlertas, true);
  assert.ok(r.json.id);
  assert.equal(llamadas[0].nombre, 'Ana López');
  assert.equal(llamadas[0].edad, edadDe('1990-05-15'));   // la edad la calcula la base, no se guarda

  const { rows } = await getPool().query('SELECT paso, respuesta FROM respuestas WHERE autoexamen_id = $1 ORDER BY paso', [r.json.id]);
  assert.equal(rows.length, 7);
  assert.equal(rows.find((x) => x.paso === 5).respuesta, 'si');
  const { rows: ex } = await getPool().query('SELECT idioma, tiene_alertas FROM autoexamenes WHERE id = $1', [r.json.id]);
  assert.deepEqual(ex[0], { idioma: 'quc', tiene_alertas: true });
});

test('si Vertex AI falla: igual se guarda, con reporte null', async () => {
  const original = vertex.generarReporte;
  vertex.generarReporte = async () => null;
  try {
    const r = await http('POST', '/api/examenes', { token: ana.accessToken, body: { idioma: 'es', respuestas: RESP_SIN_CAMBIOS } });
    assert.equal(r.status, 200);
    assert.equal(r.json.reporte, null);
    assert.equal(r.json.guardado, true);
    assert.equal(r.json.tieneAlertas, false);
  } finally {
    vertex.generarReporte = original;
  }
});

test('historial: del más reciente al más antiguo, y solo el de cada usuaria', async () => {
  const lista = await http('GET', '/api/examenes', { token: ana.accessToken });
  assert.equal(lista.status, 200);
  assert.equal(lista.json.length, 2);
  assert.ok(lista.json[0].fecha >= lista.json[1].fecha);
  assert.deepEqual(Object.keys(lista.json[0]).sort(), ['fecha', 'id', 'reporte', 'tieneAlertas']);
  assert.equal((await http('GET', '/api/examenes')).status, 401);

  const bea = (await http('POST', '/api/auth/register', {
    body: { nombre: 'Bea', fechaNacimiento: '1980-01-01', email: 'bea@correo.com', password: 'otra-clave-9' }
  })).json;
  const vacia = await http('GET', '/api/examenes', { token: bea.accessToken });
  assert.deepEqual(vacia.json, []);
});

test('refresh: rota el token; reusar el viejo falla; logout revoca', async () => {
  const r1 = await http('POST', '/api/auth/refresh', { body: { refreshToken: ana.refreshToken } });
  assert.equal(r1.status, 200);
  assert.notEqual(r1.json.refreshToken, ana.refreshToken);
  assert.equal((await http('GET', '/api/usuarios/me', { token: r1.json.accessToken })).status, 200);

  const reuso = await http('POST', '/api/auth/refresh', { body: { refreshToken: ana.refreshToken } });
  assert.equal(reuso.status, 401);
  assert.equal((await http('POST', '/api/auth/refresh', { body: {} })).status, 400);
  assert.equal((await http('POST', '/api/auth/refresh', { body: { refreshToken: 'inventado' } })).status, 401);

  assert.equal((await http('POST', '/api/auth/logout', { body: { refreshToken: r1.json.refreshToken } })).status, 204);
  assert.equal((await http('POST', '/api/auth/refresh', { body: { refreshToken: r1.json.refreshToken } })).status, 401);
});

test('un refresh token vencido no sirve', async () => {
  const login = (await http('POST', '/api/auth/login', { body: { email: 'ana@correo.com', password: 'secreta123' } })).json;
  await getPool().query("UPDATE refresh_tokens SET expira_en = now() - interval '1 minute'");
  assert.equal((await http('POST', '/api/auth/refresh', { body: { refreshToken: login.refreshToken } })).status, 401);
});

test('media: 302 a URL firmada, y solo rutas permitidas que existan', async () => {
  const ok = await http('GET', '/api/media/pasos/paso1.gif');
  assert.equal(ok.status, 302);
  assert.match(ok.headers.get('location'), /^https:\/\/storage\.googleapis\.com\/guiameapp-media\/pasos\/paso1\.gif\?/);

  assert.equal((await http('GET', '/api/media/info/que_es.jpg')).status, 302);
  assert.equal((await http('GET', '/api/media/pasos/paso9.gif')).status, 404);          // no existe
  assert.equal((await http('GET', '/api/media/secretos/llave.json')).status, 404);      // carpeta no permitida
  assert.equal((await http('GET', '/api/media/pasos/../../etc/passwd')).status, 404);   // intento de salirse
  assert.equal((await http('GET', '/api/media/pasos/%2e%2e%2fsecreto.gif')).status, 404);
});

test('fuerza bruta: tras 10 intentos fallidos con un correo, el siguiente se bloquea (429)', async () => {
  const intento = (password) => http('POST', '/api/auth/login', { body: { email: 'victima@correo.com', password } });
  await http('POST', '/api/auth/register', { body: { nombre: 'Vic', fechaNacimiento: '1992-03-03', email: 'victima@correo.com', password: 'clave-correcta-1' } });
  for (let i = 0; i < 10; i++) assert.equal((await intento('mala-' + i)).status, 401);
  const bloqueado = await intento('clave-correcta-1');   // ni con la clave correcta
  assert.equal(bloqueado.status, 429);
  assert.equal(bloqueado.json.error, 'demasiados_intentos');
  // otro correo no se ve afectado
  assert.equal((await http('POST', '/api/auth/login', { body: { email: 'ana@correo.com', password: 'secreta123' } })).status, 200);
});

test('errores: ruta inexistente y JSON mal formado', async () => {
  assert.equal((await http('GET', '/api/nada')).status, 404);
  const res = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{malo' });
  assert.equal(res.status, 400);
});

test('cabeceras de seguridad', async () => {
  const res = await fetch(base + '/health');
  assert.equal(res.headers.get('x-powered-by'), null);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
});
