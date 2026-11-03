'use strict';

const { GoogleGenAI } = require('@google/genai');
const { config } = require('../config');

let cliente;
function getCliente() {
  if (!cliente) {
    // vertexai
    cliente = new GoogleGenAI({
      vertexai: true,
      project: config.vertex.project,
      location: config.vertex.location
    });
  }
  return cliente;
}

const PREGUNTAS = {
  1: 'Observación frente al espejo: hundimientos, arrugas, enrojecimiento o cambios de forma',
  2: 'Manos detrás de la cabeza: cambios en la forma o el contorno',
  3: 'Manos en la cadera: hundimientos o algo distinto a lo habitual',
  4: 'Pezones: salida de líquido o cambios en el pezón',
  5: 'Palpación de pie: bultos, endurecimiento o dolor diferente',
  6: 'Palpación acostada: bultos o zonas más duras',
  7: 'Axilas: bultos o ganglios inflamados'
};
const TEXTO = { si: 'SÍ notó algo', no_segura: 'NO ESTÁ SEGURA', no: 'no notó nada inusual' };

function primerNombre(nombre) {
  return String(nombre || '').trim().split(/\s+/)[0].slice(0, 40);
}

function armarPrompt({ nombre, edad, respuestas, tieneAlertas }) {
  const detalle = respuestas.map((r) => `- ${PREGUNTAS[r.paso]}: ${TEXTO[r.respuesta]}`).join('\n');
  const quien = nombre
    ? `Se dirige a ${primerNombre(nombre)}${edad ? `, de ${edad} años` : ''}.`
    : 'No conoces su nombre ni su edad.';

  return `Eres la asistente de Guíame, una app de educación para el autoexamen de mama dirigida a mujeres de Guatemala.
${quien}

Resultado del autoexamen de hoy:
${detalle}

Escribe un mensaje breve (máximo 110 palabras), en español sencillo, cálido y tranquilizador, sin tecnicismos y sin emojis.
Reglas:
- ${tieneAlertas
    ? 'Marcó al menos un cambio o duda: explica con calma que la mayoría de los cambios no son cáncer, pero recomienda acudir pronto a un centro de salud para que un profesional la revise. No digas que tiene una enfermedad.'
    : 'No marcó cambios: felicítala por hacerse el autoexamen y anímala a repetirlo cada mes.'}
- Nunca des un diagnóstico ni prometas que todo está bien.
- Aclara que esto no reemplaza la revisión de un profesional de salud ni la mamografía.
- No des dosis, medicamentos ni tratamientos.
- Responde solo con el mensaje para ella, sin títulos ni listas.`;
}

/**
 * Genera el reporte con Gemini en Vertex AI. Devuelve null si falla o tarda demasiado:
 * la app igual muestra el resultado y el autoexamen se guarda sin reporte.
 */
async function generarReporte(datos) {
  try {
    const respuesta = await Promise.race([
      getCliente().models.generateContent({
        model: config.vertex.model,
        contents: armarPrompt(datos),
        config: { temperature: 0.4, maxOutputTokens: 1024 }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), config.vertex.timeoutMs))
    ]);
    const texto = (respuesta.text || '').trim();
    return texto || null;
  } catch (e) {
    // Solo el tipo de error: el mensaje podría incluir fragmentos del prompt (datos de salud)
    require('../log').error('Vertex AI falló', { tipo: e.name, estado: e.status || e.code });
    return null;
  }
}

module.exports = { generarReporte, armarPrompt };
