// Hospitales de la zona 10 de la Ciudad de Guatemala.
// Fuente: listados públicos de hospitales (directorio de la Embajada de EE. UU., directorio de Agexport y notas de prensa), octubre de 2026.
// Direcciones y tipo de hospital verificados. Los servicios se limitan a lo que se encontró publicado;
// NO se afirma que realicen mamografía donde no se pudo confirmar (por eso la nota pide verificar).
// No se incluyen teléfonos ni horarios porque cambian: el botón "Ver en el mapa" abre Google Maps con los datos vigentes.
// Para agregar o editar un hospital, basta con modificar esta lista.

export type Servicio = "mamografia" | "ultrasonido" | "biopsia" | "clinica" | "oncologia" | "imagenes";
export type TipoCentro = "publico" | "seguro" | "ong" | "privado";

type Texto = { es: string; en: string };

export type Centro = {
  id: string;
  nombre: string;
  tipo: TipoCentro;
  lugar: Texto;
  servicios: Servicio[];
  nota: Texto;
  /** Texto de búsqueda para Google Maps */
  mapa: string;
};

const igual = (s: string): Texto => ({ es: s, en: s });

export const CENTROS: Centro[] = [
  {
    id: "herrera-llerandi",
    nombre: "Hospital Herrera Llerandi",
    tipo: "privado",
    lugar: igual("6a. Avenida 8-71, zona 10, Ciudad de Guatemala"),
    servicios: ["imagenes", "oncologia"],
    nota: {
      es: "Hospital privado con centro de diagnóstico por imágenes, ginecología, oncología y prevención del cáncer. Confirma si realizan mamografía y ultrasonido mamario.",
      en: "Private hospital with a diagnostic imaging center, gynecology, oncology and cancer prevention. Confirm whether they offer mammography and breast ultrasound.",
    },
    mapa: "Hospital Herrera Llerandi zona 10 Ciudad de Guatemala",
  },
  {
    id: "centro-medico",
    nombre: "Centro Médico",
    tipo: "privado",
    lugar: igual("6a. Avenida 3-47, zona 10, Ciudad de Guatemala"),
    servicios: ["imagenes"],
    nota: {
      es: "Hospital privado con departamento de radiología. Confirma si realizan mamografía y ultrasonido mamario en esta sede.",
      en: "Private hospital with a radiology department. Confirm whether mammography and breast ultrasound are offered at this location.",
    },
    mapa: "Hospital Centro Médico zona 10 Ciudad de Guatemala",
  },
  {
    id: "esperanza",
    nombre: "Hospital Universitario Esperanza",
    tipo: "privado",
    lugar: igual("6a. Avenida 7-49, zona 10, Ciudad de Guatemala"),
    servicios: [],
    nota: {
      es: "Hospital privado. Consulta si ofrecen mamografía o ultrasonido mamario.",
      en: "Private hospital. Ask whether they offer mammography or breast ultrasound.",
    },
    mapa: "Hospital Universitario Esperanza zona 10 Ciudad de Guatemala",
  },
  {
    id: "la-paz-zona-10",
    nombre: "Centro Hospitalario La Paz (zona 10)",
    tipo: "privado",
    lugar: igual("Zona 10, Ciudad de Guatemala"),
    servicios: [],
    nota: {
      es: "Sede de la zona 10 de la red de hospitales La Paz. Consulta si ofrecen mamografía o ultrasonido mamario.",
      en: "Zone 10 location of the La Paz hospital network. Ask whether they offer mammography or breast ultrasound.",
    },
    mapa: "Hospital La Paz zona 10 Ciudad de Guatemala",
  },
];

export const mapaUrl = (consulta: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
