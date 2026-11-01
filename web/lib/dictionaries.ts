// Diccionarios de la interfaz. El español es la fuente de verdad (define la forma).
// Cualquier clave que falte en "en" o "ki" cae automáticamente al español.

export type Locale = "es" | "en" | "ki";

export const DEFAULT_LOCALE: Locale = "es";

export const LOCALES: { code: Locale; short: string; label: string }[] = [
  { code: "es", short: "ES", label: "Español" },
  { code: "en", short: "EN", label: "English" },
  { code: "ki", short: "KI", label: "K'iche'" },
];

const es = {
  nav: {
    home: "Inicio",
    app: "La app",
    report: "Reporte",
    profile: "Perfil",
    menu: "Abrir menú",
    language: "Idioma",
  },
  home: {
    title: "Cáncer de Mama",
    quote:
      "La detección precoz sigue siendo la piedra angular de la lucha contra esta enfermedad.",
    definition: {
      title: "Definición patológica",
      p1: "El cáncer de mama es una enfermedad en la que células de la mama alteradas se multiplican sin control y forman tumores que, de no tratarse, pueden propagarse por todo el cuerpo y causar la muerte. Las células cancerosas comienzan a desarrollarse dentro de los conductos galactóforos o de los lobulillos que producen leche del seno. El cáncer en estadio 0 (in situ) no es letal y se puede detectar en fases tempranas. Las células cancerosas se pueden propagar al tejido mamario cercano (invasión), lo que produce nódulos o engrosamiento.",
      p2: "Los cánceres invasivos pueden propagarse a los ganglios linfáticos cercanos o a otros órganos (metástasis). Las metástasis pueden poner en peligro la vida y ser letales. El tratamiento se basa en las características de la paciente, el tipo de cáncer y su propagación, y consiste en una combinación de cirugía, radioterapia y medicación. Aunque la incidencia es predominantemente femenina (99%), los varones representan entre el 0,5% y el 1% de los casos globales, recibiendo protocolos terapéuticos similares.",
      imageAlt: "Especialista analizando patología mamaria",
    },
    signs: {
      title: "Signos de alerta",
      items: [
        { t: "Nódulos", d: "Presencia de una masa o engrosamiento persistente, a menudo indoloro y firme al tacto." },
        { t: "Cambios cutáneos", d: "Alteraciones como hoyuelos, enrojecimiento, descamación o aspecto de «piel de naranja»." },
        { t: "Secreción", d: "Emisión anómala de fluido por el pezón (serosanguinolento) sin estar en periodo de lactancia." },
        { t: "Morfología", d: "Cambios notables en el tamaño, forma o contorno de la mama o inversión del pezón." },
      ],
    },
    selfExam: {
      title: "Autoexamen de mama",
      intro:
        "El autoexamen de mama es un chequeo que una mujer realiza en casa para buscar cambios o problemas en el tejido mamario. Aunque no sustituye a la mamografía, es una herramienta vital para la conciencia mamaria: permite conocer el estado normal de tus mamas y detectar cualquier anomalía a tiempo.",
      stepsTitle: "Pasos clave",
      steps: [
        { t: "Inspección visual", d: "Frente a un espejo, busca cambios en forma, tamaño o textura de la piel." },
        { t: "Palpación de pie", d: "Usa las yemas de los dedos en movimientos circulares buscando bultos." },
        { t: "Palpación acostada", d: "El tejido se expande uniformemente, facilitando la detección de masas." },
        { t: "Presión en el pezón", d: "Verifica si hay secreciones anómalas." },
      ],
      whenTitle: "¿Cuándo realizarlo?",
      whenBig: "7 a 10",
      whenSmall: "Días después del inicio del periodo",
      whenNote: "Si ya no menstrúas, elige un día fijo al mes (por ejemplo, el día 1) para mantener la constancia.",
      important: "Importante:",
      importantText: "una parte importante de los cánceres de mama es detectada por las propias mujeres al sentir un bulto.",
    },
    histology: {
      title: "Clasificación histológica",
      items: [
        { t: "Carcinoma ductal", d: "Representa aproximadamente el 85% de los casos. Se origina en los conductos galactóforos. El carcinoma in situ (estadio 0) es altamente tratable y no invasivo si se detecta a tiempo." },
        { t: "Carcinoma lobulillar", d: "Se desarrolla en las glándulas productoras de leche (lobulillos). Puede ser más difícil de detectar mediante mamografías convencionales debido a su patrón de crecimiento." },
        { t: "Cáncer inflamatorio", d: "Una variante agresiva pero poco frecuente donde las células cancerosas bloquean los vasos linfáticos de la piel, causando una apariencia inflamada y febril." },
      ],
    },
    risk: {
      title: "Determinantes de riesgo",
      intro: "La etiología es multifactorial. Se estima que cerca del 50% de las pacientes no presentan factores de riesgo identificables más allá del género y la edad.",
      imageAlt: "Consulta médica preventiva",
      items: [
        { tag: "BIOLÓGICOS", d: "Edad avanzada (>40 años), mutaciones genéticas (BRCA1/BRCA2) y densidad mamaria." },
        { tag: "ESTILO DE VIDA", d: "Obesidad, sedentarismo, consumo de tabaco y alcohol." },
        { tag: "HORMONALES", d: "Terapia de reemplazo postmenopáusica y nuliparidad (no haber tenido hijos)." },
      ],
    },
    treatment: {
      title: "Intervención médica",
      intro: "El tratamiento se personaliza según el subtipo biológico y el estadio. Incluye una combinación de:",
      items: [
        { t: "Cirugía", d: "Conservadora o mastectomía." },
        { t: "Radioterapia", d: "Control local tras la cirugía." },
        { t: "Terapia sistémica", d: "Quimioterapia y terapias hormonales." },
      ],
    },
    prevention: {
      title: "Estrategias de prevención",
      intro: "Reducir el riesgo es posible mediante el control de factores modificables y vigilancia proactiva:",
      items: [
        "Lactancia materna prolongada (factor protector).",
        "Actividad física regular y dieta normocalórica.",
        "Tamizaje por mamografía según las guías clínicas.",
      ],
    },
    references: "Referencias bibliográficas",
    footer: "Portal de Concientización Médica. Todo el contenido es informativo.",
  },
  appInfo: {
    badge: "Web + App Android",
    title: "Guíame",
    subtitle:
      "Tu guía para realizar el autoexamen de mama paso a paso, en tu idioma, con recordatorios según tu ciclo y reportes que puedes consultar cuando quieras.",
    ctaWeb: "Conocer sobre el cáncer de mama",
    ctaApp: "Ver mi reporte",
    featuresTitle: "¿Qué puedes hacer con Guíame?",
    features: [
      { t: "Guía paso a paso", d: "Cada paso del autoexamen se explica con texto, imágenes y recursos multimedia para que lo hagas con confianza." },
      { t: "Recordatorios a tu ritmo", d: "Registra tu ciclo menstrual y recibe notificaciones en el mejor momento para realizar tu autoexamen." },
      { t: "Reportes de tus autoexamenes", d: "Cada autoexamen genera un reporte con tu nivel de alerta y una recomendación orientativa." },
      { t: "En tu idioma", d: "Español, inglés y k'iche': la información se muestra en el idioma que elijas." },
    ],
    howTitle: "¿Cómo funciona?",
    steps: [
      { t: "Crea tu perfil", d: "Indica tu idioma y si ya estás en la menopausia para adaptar los recordatorios." },
      { t: "Realiza tu autoexamen", d: "Responde las preguntas guiadas mientras sigues cada paso." },
      { t: "Revisa tu reporte", d: "Consulta tu historial y las recomendaciones en la web o en la app." },
    ],
    platformsTitle: "Una experiencia, dos plataformas",
    web: {
      title: "Sitio web",
      items: ["Información confiable sobre cáncer de mama", "Consulta de reportes e historial", "Gestión de tu perfil e idioma"],
    },
    app: {
      title: "App Android",
      items: ["Guía interactiva del autoexamen", "Notificaciones y recordatorios", "Registro de tu ciclo menstrual"],
    },
    languagesTitle: "Hecha para todas",
    languagesText:
      "Guíame detecta el idioma de tu dispositivo y puedes cambiarlo en cualquier momento desde el menú superior.",
    disclaimer:
      "Guíame es una herramienta informativa y de concientización. No sustituye la valoración de un profesional de la salud ni la mamografía. Ante cualquier cambio en tus mamas, consulta a tu médico.",
  },
  centros: {
    title: "Hospitales cercanos (zona 10)",
    subtitle:
      "Hospitales de la zona 10 de la Ciudad de Guatemala donde puedes consultar a un profesional. Los estudios de mama pueden variar de un hospital a otro: confirma antes de ir.",
    nearMe: "Ver la zona 10 en el mapa",
    nearMeHint: "Se abre Google Maps con los hospitales de la zona.",
    nearMeQuery: "hospitales zona 10 Ciudad de Guatemala",
    allRegions: "Todo el país",
    openMap: "Ver en el mapa",
    reviewed: "Última revisión:",
    disclaimer:
      "Direcciones tomadas de listados públicos de hospitales de la Ciudad de Guatemala. No se confirmó en cada caso que realicen mamografía o ultrasonido mamario, y los servicios, horarios, costos y requisitos pueden cambiar o requerir referencia médica: confirma por teléfono antes de ir. Si notas un bulto o cambios en tu mama, no esperes: consulta a un profesional de salud.",
    kinds: {
      publico: "Hospital público",
      privado: "Hospital privado",
      seguro: "Seguro social",
      ong: "Sin fines de lucro",
    },
    services: {
      mamografia: "Mamografía",
      ultrasonido: "Ultrasonido mamario",
      biopsia: "Biopsia guiada",
      clinica: "Clínica de la mujer",
      oncologia: "Atención oncológica",
      imagenes: "Diagnóstico por imágenes",
    },
  },
  reporte: {
    title: "Mis reportes",
    subtitle: "Consulta el resultado y el historial de los autoexámenes que realizas desde la app Guíame.",
    greeting: "Hola,",
    loginTitle: "Inicia sesión para ver tus reportes",
    loginText: "Tu historial se guarda en tu cuenta.",
    loginButton: "Iniciar sesión",
    stats: {
      total: "Autoexámenes",
      last: "Último",
      clear: "Sin hallazgos",
      consult: "Consultar",
      consultHint: "Acude con tu médico",
    },
    history: "Historial",
    filters: { all: "Todos", consult: "Consultar", clear: "Sin hallazgos" },
    empty: "Aún no hay autoexámenes. Realiza uno desde la app Guíame y aparecerá aquí.",
    emptyFilter: "No hay reportes en este filtro.",
    test: "Prueba",
    selectOne: "Selecciona un reporte para ver el detalle.",
    consultTitle: "Se recomienda consultar",
    clearTitle: "Sin hallazgos preocupantes",
    badgeConsult: "Consultar",
    badgeClear: "Sin hallazgos",
    report: "Reporte",
    noReport: "Este autoexamen no incluye un reporte.",
    disclaimer:
      "Este resultado es orientativo y no sustituye una evaluación médica. Si notas cambios en tus senos, consulta a un profesional de salud.",
    retry: "Reintentar",
    loadError: "No se pudieron cargar los reportes",
    noDate: "Sin fecha",
  },
  perfil: {
    title: "Mi perfil",
    subtitle: "Datos de tu cuenta en Guíame.",
    noSession: "No has iniciado sesión",
    noSessionText: "Inicia sesión para ver los datos de tu cuenta.",
    login: "Iniciar sesión",
    name: "Nombre",
    email: "Correo electrónico",
    age: "Edad",
    years: "años",
    readOnly: "Esta información es de solo consulta.",
    historyTitle: "Historial de reportes",
    historyText: "Revisa los resultados de los autoexámenes que realizas desde la app.",
    historyButton: "Ver mis reportes",
    sessionTitle: "Sesión",
    sessionText: "Cierra sesión en este dispositivo.",
    logout: "Cerrar sesión",
    loggingOut: "Cerrando...",
  },
  auth: {
    loginTitle: "Iniciar sesión",
    email: "Correo",
    password: "Contraseña",
    loginButton: "Iniciar sesión",
    loggingIn: "Entrando...",
    noAccount: "¿No tienes cuenta? Regístrate",
    viewHome: "Ver la página principal",
    orContinue: "o",
    errBoth: "Ingresa tu correo y contraseña",
    errEmail: "Ingresa tu correo",
    errEmailInvalid: "Ingresa un correo válido (ej: usuario@gmail.com)",
    errPassword: "Ingresa tu contraseña",
    errGeneric: "No se pudo iniciar sesión. Intenta de nuevo",
    registerTitle: "Crear cuenta",
    fullName: "Nombre completo",
    passwordHint: "Contraseña (mínimo 8 caracteres)",
    birthDate: "Fecha de nacimiento",
    registerButton: "Registrarse",
    registering: "Creando cuenta...",
    haveAccount: "¿Ya tienes cuenta?",
    errFields: "Completa todos los campos",
    errPasswordShort: "La contraseña debe tener al menos 8 caracteres",
    errPasswordLong: "La contraseña es demasiado larga (máximo 72 caracteres)",
    errBirth: "Ingresa una fecha de nacimiento válida",
    errRegisterGeneric: "Error al registrarse",
    // Mensajes del servidor (api.ts devuelve el código en ApiError.code)
    errors: {
      credenciales_invalidas: "Correo o contraseña incorrectos",
      demasiados_intentos: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo",
      correo_en_uso: "Ese correo ya está registrado",
      nombre_invalido: "Ingresa un nombre válido",
      correo_invalido: "Ingresa un correo válido",
      fecha_nacimiento_invalida: "Ingresa una fecha de nacimiento válida",
      contrasena_invalida: "La contraseña debe tener entre 8 y 72 caracteres",
      campos_incompletos: "Completa todos los campos",
      no_autenticada: "Tu sesión expiró. Inicia sesión de nuevo",
      token_invalido: "Tu sesión expiró. Inicia sesión de nuevo",
      refresh_invalido: "Tu sesión expiró. Inicia sesión de nuevo",
      red: "No se pudo conectar con el servidor",
      config: "Falta NEXT_PUBLIC_API_URL en .env.local",
    },
  },
};

export type Dictionary = typeof es;

type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

const en: Dictionary = {
  nav: {
    home: "Home",
    app: "The app",
    report: "Report",
    profile: "Profile",
    menu: "Open menu",
    language: "Language",
  },
  home: {
    title: "Breast Cancer",
    quote: "Early detection remains the cornerstone of the fight against this disease.",
    definition: {
      title: "Pathological definition",
      p1: "Breast cancer is a disease in which altered breast cells multiply uncontrollably and form tumors that, if left untreated, can spread throughout the body and cause death. Cancer cells begin to develop inside the milk ducts or the milk-producing lobules of the breast. Stage 0 (in situ) cancer is not lethal and can be detected early. Cancer cells can spread to nearby breast tissue (invasion), producing lumps or thickening.",
      p2: "Invasive cancers can spread to nearby lymph nodes or other organs (metastasis). Metastases can be life-threatening and lethal. Treatment depends on the patient's characteristics, the type of cancer and how far it has spread, and combines surgery, radiotherapy and medication. Although incidence is predominantly female (99%), men account for 0.5% to 1% of cases worldwide and receive similar treatment protocols.",
      imageAlt: "Specialist analyzing breast pathology",
    },
    signs: {
      title: "Warning signs",
      items: [
        { t: "Lumps", d: "A persistent mass or thickening, often painless and firm to the touch." },
        { t: "Skin changes", d: "Dimpling, redness, scaling or an “orange peel” appearance." },
        { t: "Discharge", d: "Abnormal (bloody or clear) fluid from the nipple when not breastfeeding." },
        { t: "Shape", d: "Noticeable changes in the size, shape or contour of the breast, or a nipple turning inward." },
      ],
    },
    selfExam: {
      title: "Breast self-exam",
      intro:
        "A breast self-exam is a check a woman does at home to look for changes or problems in breast tissue. Although it does not replace mammography, it is a vital tool for breast awareness: it helps you learn what is normal for your breasts and notice any change in time.",
      stepsTitle: "Key steps",
      steps: [
        { t: "Visual inspection", d: "In front of a mirror, look for changes in shape, size or skin texture." },
        { t: "Standing palpation", d: "Use your fingertips in circular movements to feel for lumps." },
        { t: "Lying-down palpation", d: "The tissue spreads out evenly, making masses easier to detect." },
        { t: "Nipple pressure", d: "Check for any abnormal discharge." },
      ],
      whenTitle: "When to do it?",
      whenBig: "7 to 10",
      whenSmall: "Days after your period starts",
      whenNote: "If you no longer have periods, pick a fixed day each month (for example, the 1st) to stay consistent.",
      important: "Important:",
      importantText: "a significant share of breast cancers are found by women who feel a lump themselves.",
    },
    histology: {
      title: "Histological classification",
      items: [
        { t: "Ductal carcinoma", d: "About 85% of cases. It starts in the milk ducts. In situ carcinoma (stage 0) is highly treatable and non-invasive when caught early." },
        { t: "Lobular carcinoma", d: "Develops in the milk-producing glands (lobules). It can be harder to detect on conventional mammograms because of its growth pattern." },
        { t: "Inflammatory cancer", d: "An aggressive but rare variant in which cancer cells block the lymph vessels of the skin, causing a swollen, warm appearance." },
      ],
    },
    risk: {
      title: "Risk determinants",
      intro: "The cause is multifactorial. About 50% of patients have no identifiable risk factors beyond sex and age.",
      imageAlt: "Preventive medical consultation",
      items: [
        { tag: "BIOLOGICAL", d: "Older age (>40 years), genetic mutations (BRCA1/BRCA2) and breast density." },
        { tag: "LIFESTYLE", d: "Obesity, sedentary lifestyle, tobacco and alcohol use." },
        { tag: "HORMONAL", d: "Postmenopausal hormone replacement therapy and nulliparity (never having children)." },
      ],
    },
    treatment: {
      title: "Medical intervention",
      intro: "Treatment is personalized by biological subtype and stage. It combines:",
      items: [
        { t: "Surgery", d: "Breast-conserving surgery or mastectomy." },
        { t: "Radiotherapy", d: "Local control after surgery." },
        { t: "Systemic therapy", d: "Chemotherapy and hormone therapy." },
      ],
    },
    prevention: {
      title: "Prevention strategies",
      intro: "Risk can be reduced by controlling modifiable factors and staying proactive:",
      items: [
        "Prolonged breastfeeding (protective factor).",
        "Regular physical activity and a balanced diet.",
        "Mammography screening according to clinical guidelines.",
      ],
    },
    references: "References",
    footer: "Medical Awareness Portal. All content is for information only.",
  },
  appInfo: {
    badge: "Web + Android app",
    title: "Guíame",
    subtitle:
      "Your guide to doing a breast self-exam step by step, in your language, with reminders based on your cycle and reports you can check any time.",
    ctaWeb: "Learn about breast cancer",
    ctaApp: "See my report",
    featuresTitle: "What can you do with Guíame?",
    features: [
      { t: "Step-by-step guide", d: "Every step of the self-exam is explained with text, images and multimedia so you can do it with confidence." },
      { t: "Reminders at your pace", d: "Log your menstrual cycle and get notified at the best time to do your self-exam." },
      { t: "Self-exam reports", d: "Each self-exam produces a report with your alert level and a guidance recommendation." },
      { t: "In your language", d: "Spanish, English and K'iche': information is shown in the language you choose." },
    ],
    howTitle: "How does it work?",
    steps: [
      { t: "Create your profile", d: "Tell us your language and whether you are postmenopausal so reminders fit you." },
      { t: "Do your self-exam", d: "Answer the guided questions while you follow each step." },
      { t: "Review your report", d: "Check your history and recommendations on the web or in the app." },
    ],
    platformsTitle: "One experience, two platforms",
    web: {
      title: "Website",
      items: ["Reliable information about breast cancer", "Reports and history", "Profile and language settings"],
    },
    app: {
      title: "Android app",
      items: ["Interactive self-exam guide", "Notifications and reminders", "Menstrual cycle tracking"],
    },
    languagesTitle: "Made for everyone",
    languagesText:
      "Guíame detects your device language and you can change it at any time from the top menu.",
    disclaimer:
      "Guíame is an informational and awareness tool. It does not replace evaluation by a health professional or mammography. If you notice any change in your breasts, see your doctor.",
  },
  centros: {
    title: "Nearby hospitals (Zone 10)",
    subtitle:
      "Hospitals in Zone 10 of Guatemala City where you can see a professional. Breast imaging services may vary from one hospital to another: confirm before you go.",
    nearMe: "View Zone 10 on the map",
    nearMeHint: "Opens Google Maps with the hospitals in the area.",
    nearMeQuery: "hospitals zona 10 Guatemala City",
    allRegions: "Nationwide",
    openMap: "View on map",
    reviewed: "Last reviewed:",
    disclaimer:
      "Addresses taken from public hospital listings for Guatemala City. We could not confirm in every case that they offer mammography or breast ultrasound, and services, hours, costs and requirements may change or require a medical referral: call to confirm before you go. If you notice a lump or changes in your breast, do not wait: see a health professional.",
    kinds: {
      publico: "Public hospital",
      privado: "Private hospital",
      seguro: "Social security",
      ong: "Non-profit",
    },
    services: {
      mamografia: "Mammography",
      ultrasonido: "Breast ultrasound",
      biopsia: "Guided biopsy",
      clinica: "Women's clinic",
      oncologia: "Cancer care",
      imagenes: "Diagnostic imaging",
    },
  },
  reporte: {
    title: "My reports",
    subtitle: "Check the result and history of the self-exams you do in the Guíame app.",
    greeting: "Hi,",
    loginTitle: "Log in to see your reports",
    loginText: "Your history is saved in your account.",
    loginButton: "Log in",
    stats: {
      total: "Self-exams",
      last: "Latest",
      clear: "No findings",
      consult: "See a doctor",
      consultHint: "Visit your doctor",
    },
    history: "History",
    filters: { all: "All", consult: "See a doctor", clear: "No findings" },
    empty: "No self-exams yet. Do one in the Guíame app and it will appear here.",
    emptyFilter: "No reports in this filter.",
    test: "Test",
    selectOne: "Select a report to see the details.",
    consultTitle: "Seeing a doctor is recommended",
    clearTitle: "No concerning findings",
    badgeConsult: "See a doctor",
    badgeClear: "No findings",
    report: "Report",
    noReport: "This self-exam has no report.",
    disclaimer:
      "This result is for guidance only and does not replace a medical evaluation. If you notice changes in your breasts, consult a health professional.",
    retry: "Retry",
    loadError: "Reports could not be loaded",
    noDate: "No date",
  },
  perfil: {
    title: "My profile",
    subtitle: "Your Guíame account details.",
    noSession: "You are not logged in",
    noSessionText: "Log in to see your account details.",
    login: "Log in",
    name: "Name",
    email: "Email",
    age: "Age",
    years: "years old",
    readOnly: "This information is read-only.",
    historyTitle: "Report history",
    historyText: "Review the results of the self-exams you do in the app.",
    historyButton: "View my reports",
    sessionTitle: "Session",
    sessionText: "Log out on this device.",
    logout: "Log out",
    loggingOut: "Logging out...",
  },
  auth: {
    loginTitle: "Log in",
    email: "Email",
    password: "Password",
    loginButton: "Log in",
    loggingIn: "Signing in...",
    noAccount: "Don't have an account? Sign up",
    viewHome: "Go to the home page",
    orContinue: "or",
    errBoth: "Enter your email and password",
    errEmail: "Enter your email",
    errEmailInvalid: "Enter a valid email (e.g. user@gmail.com)",
    errPassword: "Enter your password",
    errGeneric: "Could not log in. Please try again",
    registerTitle: "Create account",
    fullName: "Full name",
    passwordHint: "Password (at least 8 characters)",
    birthDate: "Date of birth",
    registerButton: "Sign up",
    registering: "Creating account...",
    haveAccount: "Already have an account?",
    errFields: "Fill in all fields",
    errPasswordShort: "Password must be at least 8 characters",
    errPasswordLong: "Password is too long (maximum 72 characters)",
    errBirth: "Enter a valid date of birth",
    errRegisterGeneric: "Could not sign up",
    errors: {
      credenciales_invalidas: "Incorrect email or password",
      demasiados_intentos: "Too many attempts. Wait a few minutes and try again",
      correo_en_uso: "That email is already registered",
      nombre_invalido: "Enter a valid name",
      correo_invalido: "Enter a valid email",
      fecha_nacimiento_invalida: "Enter a valid date of birth",
      contrasena_invalida: "Password must be between 8 and 72 characters",
      campos_incompletos: "Fill in all fields",
      no_autenticada: "Your session expired. Log in again",
      token_invalido: "Your session expired. Log in again",
      refresh_invalido: "Your session expired. Log in again",
      red: "Could not connect to the server",
      config: "Missing NEXT_PUBLIC_API_URL in .env.local",
    },
  },
};

// K'iche': PENDIENTE de traducción revisada
// Los textos de las preguntas del autoexamen vienen de la BD (Texto_pregunta / texto_ki).
const ki: DeepPartial<Dictionary> = {

};

export const dictionaries: Record<Locale, DeepPartial<Dictionary>> = { es, en, ki };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : override) as T;
  }
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    out[key] = deepMerge((base as Record<string, unknown>)[key], override[key]);
  }
  return out as T;
}

export function getDictionary(locale: Locale): Dictionary {
  if (locale === "es") return es;
  return deepMerge(es, dictionaries[locale]);
}