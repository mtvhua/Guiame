'use strict';

// Cloud Logging entiende JSON con "severity" en stdout. IMPORTANTE: nunca registrar contraseñas,
// tokens, respuestas del autoexamen ni reportes (son datos de salud).
function log(severity, message, extra = {}) {
  console.log(JSON.stringify({ severity, message, ...extra }));
}

module.exports = {
  info: (m, e) => log('INFO', m, e),
  warn: (m, e) => log('WARNING', m, e),
  error: (m, e) => log('ERROR', m, e)
};
