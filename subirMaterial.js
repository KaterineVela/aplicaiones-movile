// subirMaterial.js
// Ejecutar con: node subirMaterial.js
// Este script toma todo el material de estudio que estaba hardcodeado
// en las pantallas y lo sube a Firestore en la colección "material".
// Una vez ejecutado, el backend Kotlin puede servirlo mediante la API REST.

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDL6vSCeM0bL93QYROqbg4KNHdlxP6KyvA",
  authDomain: "icfes-app-20982.firebaseapp.com",
  projectId: "icfes-app-20982",
  storageBucket: "icfes-app-20982.firebasestorage.app",
  messagingSenderId: "294707517093",
  appId: "1:294707517093:web:2055240e7f65c6ffc09f4c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── MATERIAL DE CIENCIAS SOCIALES ──────────────────────────────────────────
// Cada objeto representa un tema con sus secciones y viñetas.
// El campo "materia" permite filtrarlo desde el backend con whereEqualTo.
const materialSociales = [
  {
    materia: "sociales",
    id: "historia",
    icono: "🏛️",
    titulo: "Historia de Colombia y del Mundo",
    resumen: "Independencia, Constitución de 1991, guerras mundiales y más.",
    color: "#7B61FF",
    orden: 1,
    secciones: [
      {
        subtitulo: "La Independencia de Colombia",
        viñetas: [
          "Las ideas de libertad de la Revolución Francesa inspiraron a los criollos americanos a finales del siglo XVIII.",
          "El 20 de julio de 1810 ocurrió el Grito de Independencia con el incidente del florero de Llorente en Bogotá.",
          "La batalla de Boyacá el 7 de agosto de 1819, liderada por Simón Bolívar y Francisco de Paula Santander, consolidó la independencia."
        ]
      },
      {
        subtitulo: "La Constitución de 1991",
        viñetas: [
          "Colombia vivía una gran crisis: narcotráfico, violencia política y desigualdad social.",
          "El movimiento estudiantil llamado La Séptima Papeleta impulsó la convocatoria a una Asamblea Nacional Constituyente.",
          "La Constitución de 1991 reconoce a Colombia como un Estado Social de Derecho.",
          "Garantiza derechos fundamentales como la salud, la educación y la tutela.",
          "Incluye por primera vez a comunidades indígenas, afrodescendientes y la diversidad religiosa."
        ]
      },
      {
        subtitulo: "Primera Guerra Mundial, de 1914 a 1918",
        viñetas: [
          "Desencadenada por el asesinato del archiduque Francisco Fernando en Sarajevo.",
          "Enfrentó a la Triple Entente, que era Francia, Reino Unido y Rusia, contra las Potencias Centrales, que eran Alemania y Austria-Hungría.",
          "Terminó con el Tratado de Versalles, que impuso condiciones humillantes a Alemania."
        ]
      },
      {
        subtitulo: "Segunda Guerra Mundial, de 1939 a 1945",
        viñetas: [
          "Comenzó con la invasión de Polonia por la Alemania nazi de Adolf Hitler.",
          "Fue el conflicto más devastador de la historia, con más de 70 millones de muertos.",
          "Incluyó el Holocausto judío y el uso de la bomba atómica en Japón.",
          "Terminó con la rendición de Alemania y Japón, surgiendo Estados Unidos y la URSS como superpotencias."
        ]
      }
    ],
    glosario: [
      { termino: "Democracia", definicion: "Sistema de gobierno donde el poder lo ejerce el pueblo a través del voto." },
      { termino: "Soberanía", definicion: "Poder supremo de un Estado para gobernarse sin interferencias externas." },
      { termino: "Globalización", definicion: "Proceso de integración económica, política y cultural entre países del mundo." },
      { termino: "Estado de Derecho", definicion: "Sistema en que todos, incluido el gobierno, están sometidos a la ley." },
      { termino: "Tutela", definicion: "Mecanismo legal para proteger derechos fundamentales de forma inmediata." },
      { termino: "PIB", definicion: "Valor total de los bienes y servicios producidos por un país en un año." },
      { termino: "Referendo", definicion: "Mecanismo mediante el cual los ciudadanos votan directamente sobre una ley o reforma." }
    ]
  },
  {
    materia: "sociales",
    id: "geografia",
    icono: "🗺️",
    titulo: "Geografía",
    resumen: "Colombia, sus regiones, departamentos y fenómenos geográficos.",
    color: "#FF6B6B",
    orden: 2,
    secciones: [
      {
        subtitulo: "Colombia y sus fronteras",
        viñetas: [
          "Colombia está en el noroccidente de América del Sur.",
          "Al norte limita con el mar Caribe y Panamá.",
          "Al sur limita con Perú y Ecuador.",
          "Al oriente limita con Venezuela y Brasil.",
          "Al occidente limita con el océano Pacífico.",
          "Es el único país de Suramérica con costas en el Pacífico y en el Caribe."
        ]
      },
      {
        subtitulo: "Las seis regiones naturales de Colombia",
        viñetas: [
          "Región Andina: la más poblada, atravesada por los Andes. Ciudades principales: Bogotá, Medellín y Cali.",
          "Región Caribe: costas en el mar Caribe, clima cálido. Ciudades principales: Barranquilla y Cartagena.",
          "Región Pacífica: gran biodiversidad y lluvias intensas. Ciudad principal: Buenaventura.",
          "Región Orinoquía: grandes llanuras y ríos. Ciudad principal: Villavicencio.",
          "Región Amazónica: selva tropical, pulmón del mundo. Ciudad principal: Leticia.",
          "Región Insular: islas como San Andrés y Providencia en el Caribe."
        ]
      },
      {
        subtitulo: "Fenómenos geográficos",
        viñetas: [
          "El Fenómeno de El Niño provoca sequías en algunas zonas y lluvias intensas en otras.",
          "La Niña tiene el efecto contrario: más lluvias en zonas que normalmente son secas.",
          "Estos fenómenos afectan la agricultura, el agua y la energía eléctrica en Colombia.",
          "Colombia depende mucho de la energía hidroeléctrica, lo que la hace vulnerable a las sequías."
        ]
      }
    ],
    glosario: []
  },
  {
    materia: "sociales",
    id: "economia",
    icono: "💰",
    titulo: "Economía",
    resumen: "Oferta, demanda, inflación, PIB y modelos económicos.",
    color: "#4CAF50",
    orden: 3,
    secciones: [
      {
        subtitulo: "Oferta y Demanda",
        viñetas: [
          "La oferta es la cantidad de un bien que los productores están dispuestos a vender a un precio dado.",
          "La demanda es la cantidad que los consumidores desean comprar a un precio dado.",
          "Cuando sube el precio del arroz por una sequía, hay menor oferta y el precio sube porque la demanda no cambia."
        ]
      },
      {
        subtitulo: "Inflación",
        viñetas: [
          "Es el aumento general y sostenido de los precios en una economía.",
          "Ejemplo: si un almuerzo cuesta cinco mil pesos hoy y cinco mil quinientos el año siguiente, eso es inflación.",
          "El Banco de la República controla la inflación subiendo o bajando las tasas de interés."
        ]
      },
      {
        subtitulo: "PIB o Producto Interno Bruto",
        viñetas: [
          "Es el valor total de todos los bienes y servicios que produce un país en un año.",
          "Si el PIB de Colombia sube, la economía está creciendo y hay más empleo.",
          "Si el PIB baja de forma sostenida, hay recesión económica."
        ]
      },
      {
        subtitulo: "Neoliberalismo",
        viñetas: [
          "Modelo que propone reducir la intervención del Estado en la economía.",
          "Propone privatizar empresas públicas y abrir los mercados al comercio internacional.",
          "En los años noventa, Colombia aplicó medidas neoliberales por presión del Fondo Monetario Internacional."
        ]
      },
      {
        subtitulo: "Proteccionismo",
        viñetas: [
          "Es lo contrario al libre comercio: el Estado protege la industria nacional.",
          "El Estado pone aranceles, que son impuestos, a los productos extranjeros.",
          "Ejemplo: Colombia pone arancel alto al arroz importado para proteger a los agricultores."
        ]
      }
    ],
    glosario: []
  },
  {
    materia: "sociales",
    id: "politica",
    icono: "⚖️",
    titulo: "Política y Ciudadanía",
    resumen: "Constitución, derechos fundamentales y Estado colombiano.",
    color: "#FF9800",
    orden: 4,
    secciones: [
      {
        subtitulo: "La Constitución de 1991",
        viñetas: [
          "Es la ley de leyes: todos los decretos y normas deben respetarla.",
          "Establece que Colombia es un Estado Social de Derecho.",
          "El Estado tiene la obligación de garantizar los derechos fundamentales de todos los ciudadanos."
        ]
      },
      {
        subtitulo: "Derechos Fundamentales",
        viñetas: [
          "Derecho a la vida: nadie puede ser privado de la vida arbitrariamente.",
          "Derecho a la igualdad: todas las personas son iguales ante la ley, sin discriminación.",
          "Derecho a la educación: el Estado garantiza educación gratuita hasta el grado noveno.",
          "Derecho a la salud: cuando la salud pone en riesgo la vida, se puede exigir con tutela.",
          "Derecho al voto: puedes elegir a tus representantes cada cuatro años."
        ]
      },
      {
        subtitulo: "La Tutela",
        viñetas: [
          "Es el mecanismo más poderoso para proteger los derechos fundamentales.",
          "Cualquier persona puede presentarla sin necesidad de abogado.",
          "El juez tiene diez días para responder.",
          "Ejemplo: si una EPS niega un tratamiento urgente, el juez puede obligarla a darlo."
        ]
      },
      {
        subtitulo: "Las tres ramas del Poder Público",
        viñetas: [
          "Rama Legislativa, que es el Congreso: hace las leyes. Tiene el Senado y la Cámara de Representantes.",
          "Rama Ejecutiva, que es el Presidente: aplica las leyes y gobierna. El presidente es elegido cada cuatro años.",
          "Rama Judicial, que son las Cortes: interpreta las leyes y aplica justicia. La Corte Constitucional protege la Constitución."
        ]
      },
      {
        subtitulo: "Mecanismos de participación ciudadana",
        viñetas: [
          "El voto: para elegir representantes.",
          "El referendo: para reformar la Constitución o las leyes mediante votación popular.",
          "El plebiscito: para que el pueblo apruebe o rechace una decisión del presidente.",
          "La consulta popular: para que la comunidad opine sobre una decisión importante.",
          "La tutela: para proteger derechos fundamentales de forma inmediata.",
          "La acción de cumplimiento: para exigir que una ley se cumpla."
        ]
      }
    ],
    glosario: [
      { termino: "Democracia", definicion: "Sistema de gobierno donde el poder lo ejerce el pueblo a través del voto." },
      { termino: "Soberanía", definicion: "Poder supremo de un Estado para gobernarse sin interferencias externas." },
      { termino: "Estado de Derecho", definicion: "Sistema en que todos, incluido el gobierno, están sometidos a la ley." },
      { termino: "Tutela", definicion: "Mecanismo legal para proteger derechos fundamentales de forma inmediata." },
      { termino: "Referendo", definicion: "Mecanismo mediante el cual los ciudadanos votan directamente sobre una ley o reforma." }
    ]
  }
];

// ─── MATERIAL DE INGLÉS ─────────────────────────────────────────────────────
const materialIngles = [
  {
    materia: "ingles",
    id: "vocabulary",
    icono: "🔤",
    titulo: "Vocabulary",
    resumen: "Clothes, accessories, transport and everyday words.",
    color: "#0EA5E9",
    orden: 1,
    secciones: [
      {
        subtitulo: "Clothes and accessories",
        viñetas: [
          "glasses — you wear them on your face to see better.",
          "handbag — a bag you carry in your hand to keep your things.",
          "hat — you wear it on your head.",
          "pajamas — you wear them when you go to bed.",
          "scarf — you wrap it around your neck to keep warm.",
          "skirt — a piece of clothing worn around the waist.",
          "socks — you wear them on your feet, inside your shoes.",
          "watch — you wear it on your wrist to know the time."
        ]
      },
      {
        subtitulo: "Transportation",
        viñetas: [
          "bike or bicycle — you pedal it. Most people learn to ride as a child.",
          "bus — public road transport. You pay a fare.",
          "plane — air transport for long journeys.",
          "train — transport that runs on rails.",
          "boat — transport on water.",
          "motorbike — a two-wheeled vehicle with a motor.",
          "ambulance — takes sick or injured people to hospital.",
          "truck — carries heavy loads on the road."
        ]
      }
    ],
    glosario: [
      { term: "Vocabulary", definition: "All the words of a language or the words known by a person." },
      { term: "Context", definition: "The words and sentences around a word that help you understand its meaning." }
    ]
  },
  {
    materia: "ingles",
    id: "grammar",
    icono: "📐",
    titulo: "Grammar",
    resumen: "Comparatives, superlatives, modals and verb tenses.",
    color: "#8B5CF6",
    orden: 2,
    secciones: [
      {
        subtitulo: "Comparatives and superlatives",
        viñetas: [
          "much, more, most: used with uncountable nouns.",
          "Example: Its most important component is caffeine. This is a superlative.",
          "good, better, best.",
          "bad, worse, worst.",
          "Tip: use superlatives when comparing one thing against all others in a group."
        ]
      },
      {
        subtitulo: "Time prepositions",
        viñetas: [
          "since: from a specific point in time. Example: since 1990, since the 14th century.",
          "during: throughout a period. Example: during the war, during the sixties.",
          "until: up to a point in time. Example: until midnight.",
          "for: a length of time. Example: for two years, for a long time.",
          "Tip: use since with a specific moment. Use for with a duration."
        ]
      },
      {
        subtitulo: "Modal verbs",
        viñetas: [
          "mustn't: strong prohibition. Example: You mustn't believe this.",
          "couldn't: inability in the past. Example: I couldn't buy oil paints.",
          "wouldn't: conditional refusal. Example: My parents wouldn't buy them for me.",
          "shouldn't: negative advice. Example: You shouldn't eat too much sugar.",
          "shall: used to offer help. Example: Shall I hold those bags for you?"
        ]
      },
      {
        subtitulo: "Key verb tenses",
        viñetas: [
          "Simple past: for finished actions. Example: Caffeine was described in the 1800s.",
          "Present perfect: actions from the past that continue. Example: Coffee has been well-known since the 14th century.",
          "Gerund, that is the ing form: after verbs like say, enjoy, stop. Example: Some people say drinking coffee isn't good.",
          "Passive voice: focus on the action, not who does it. Example: Caffeine was first described by Ferdinand Runge."
        ]
      },
      {
        subtitulo: "Connectors and relative pronouns",
        viñetas: [
          "when: time connector. Example: When Sufi Yemenis started using coffee.",
          "which: for things. Example: It is an animal which is called the Simien Jackal.",
          "who: for people. Example: A doctor who found out some effects of coffee.",
          "while: contrast. Example: While many people believe coffee is bad, studies show it is good.",
          "among: within a group. Example: It became popular among Europeans."
        ]
      }
    ],
    glosario: [
      { term: "Grammar", definition: "The rules of a language that explain how words are combined to form sentences." },
      { term: "Modal verb", definition: "A verb like must, can, should or would that expresses ability, obligation or possibility." },
      { term: "Superlative", definition: "The form of an adjective that expresses the highest degree: best, most important." },
      { term: "Conjunction", definition: "A word that connects two sentences or ideas: and, but, while, because." }
    ]
  },
  {
    materia: "ingles",
    id: "reading",
    icono: "📖",
    titulo: "Reading comprehension",
    resumen: "Strategies for ICFES English reading questions.",
    color: "#10B981",
    orden: 3,
    secciones: [
      {
        subtitulo: "Types of reading questions in the ICFES",
        viñetas: [
          "Explicit information: the answer is directly stated in the text.",
          "Inference: you must deduce something not directly written.",
          "Vocabulary in context: choose the right word for a blank space.",
          "Author's purpose: what is the writer trying to do with this text?"
        ]
      },
      {
        subtitulo: "Strategies to answer well",
        viñetas: [
          "Read the questions first, then the text. Know what to look for.",
          "Find key words from the question inside the text.",
          "For fill-in-the-blank, read the full sentence before and after the gap.",
          "Eliminate clearly wrong options before choosing.",
          "If you don't know a word, use the surrounding context to guess its meaning."
        ]
      },
      {
        subtitulo: "Text types in the exam",
        viñetas: [
          "Signs and notices: short instructions. Question: Where can you see this sign?",
          "Informational articles: texts about people, places or topics.",
          "Fill-in-the-blank texts: a passage with gaps to complete.",
          "Conversations: short dialogues. Choose the most logical reply.",
          "Letters or reviews: personal texts expressing opinion or experience."
        ]
      }
    ],
    glosario: [
      { term: "Inference", definition: "A conclusion you reach based on evidence in the text, not directly stated." }
    ]
  },
  {
    materia: "ingles",
    id: "conversations",
    icono: "💬",
    titulo: "Conversations",
    resumen: "How to choose the most logical reply in a dialogue.",
    color: "#F59E0B",
    orden: 4,
    secciones: [
      {
        subtitulo: "Common responses",
        viñetas: [
          "Shall I help you? The correct answer is: That's fine, or Sure. This is an offer of help followed by acceptance.",
          "How much is it? The correct answer is the price, for example: 50 dollars.",
          "I think I am getting sick. The correct answer is: I am sorry. This shows empathy.",
          "I am going on vacation! The correct answer is: That's great! This is a positive reaction to good news.",
          "I can't eat this. It is horrible! The correct answer is: I agree. This shows agreement with a complaint."
        ]
      },
      {
        subtitulo: "Common mistakes to avoid",
        viñetas: [
          "Do not choose an answer just because it repeats words from the question. That is a trap.",
          "The reply must make logical sense in the context of the conversation.",
          "Ask yourself: what would a real person say in this situation?",
          "Example: Shall I hold those bags? The answer is That's fine, not I'm not afraid.",
          "Example: How much is the umbrella? The answer is 50 dollars, not Cash only, because that is a rule, not a price."
        ]
      }
    ],
    glosario: []
  }
];

// ─── SUBIR A FIRESTORE ───────────────────────────────────────────────────────
// Combinamos todo el material en un solo arreglo y subimos cada tema
// como un documento independiente en la colección "material".
// Esto permite filtrar por materia desde el backend con whereEqualTo("materia", area).
async function subirMaterial() {
  const todo = [...materialSociales, ...materialIngles];
  console.log(`Subiendo ${todo.length} temas de material a Firestore...`);

  for (const tema of todo) {
    await addDoc(collection(db, "material"), tema);
    console.log(`✅ Subido: [${tema.materia}] ${tema.titulo}`);
  }

  console.log("\n🎉 ¡Todo el material fue subido exitosamente!");
  process.exit(0);
}

subirMaterial().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});