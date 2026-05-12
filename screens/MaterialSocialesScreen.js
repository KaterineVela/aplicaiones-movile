import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityContext } from "../context/AccessibilityContext";

const contenidos = [
  {
    id: "historia",
    icono: "🏛️",
    titulo: "Historia de Colombia y del Mundo",
    resumen: "Independencia, Constitución de 1991, guerras mundiales y más.",
    color: "#7B61FF",
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
    ]
  },
  {
    id: "geografia",
    icono: "🗺️",
    titulo: "Geografía",
    resumen: "Colombia, sus regiones, departamentos y fenómenos geográficos.",
    color: "#FF6B6B",
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
    ]
  },
  {
    id: "economia",
    icono: "💰",
    titulo: "Economía",
    resumen: "Oferta, demanda, inflación, PIB y modelos económicos.",
    color: "#4CAF50",
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
    ]
  },
  {
    id: "politica",
    icono: "⚖️",
    titulo: "Política y Ciudadanía",
    resumen: "Constitución, derechos fundamentales y Estado colombiano.",
    color: "#FF9800",
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
    ]
  }
];

const glosario = [
  { termino: "Democracia", definicion: "Sistema de gobierno donde el poder lo ejerce el pueblo a través del voto." },
  { termino: "Soberanía", definicion: "Poder supremo de un Estado para gobernarse sin interferencias externas." },
  { termino: "Globalización", definicion: "Proceso de integración económica, política y cultural entre países del mundo." },
  { termino: "Estado de Derecho", definicion: "Sistema en que todos, incluido el gobierno, están sometidos a la ley." },
  { termino: "Tutela", definicion: "Mecanismo legal para proteger derechos fundamentales de forma inmediata." },
  { termino: "PIB", definicion: "Valor total de los bienes y servicios producidos por un país en un año." },
  { termino: "Referendo", definicion: "Mecanismo mediante el cual los ciudadanos votan directamente sobre una ley o reforma." }
];

// Construye el texto completo de un tema para que la voz lo lea todo
function construirTextoVoz(item) {
  let texto = `${item.titulo}. `;
  item.secciones.forEach(seccion => {
    texto += `${seccion.subtitulo}. `;
    seccion.viñetas.forEach(viñeta => {
      texto += `${viñeta}. `;
    });
  });
  return texto;
}

export default function MaterialSocialesScreen({ navigation }) {
  const { vozActiva, hablar, toggleVoz } = useContext(AccessibilityContext);
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    if (vozActiva) {
      hablar(
        "Material de estudio de Ciencias Sociales. Tienes cuatro temas disponibles. " +
        "Primera opción, parte superior: Historia de Colombia y del mundo. " +
        "Segunda opción: Geografía. " +
        "Tercera opción: Economía. " +
        "Cuarta opción, parte inferior: Política y Ciudadanía. " +
        "Toca cualquier tema para expandirlo y escuchar todo su contenido. " +
        "Al final de la pantalla hay un glosario de términos clave."
      );
    }
  }, []);

  const posicionTema = (index) => {
    const pos = [
      "Primera opción, parte superior",
      "Segunda opción",
      "Tercera opción",
      "Cuarta opción, parte inferior"
    ];
    return pos[index] || `Opción ${index + 1}`;
  };

  const toggleTema = (item, index) => {
    if (expandido === item.id) {
      setExpandido(null);
      if (vozActiva) hablar(`Cerrando ${item.titulo}`);
    } else {
      setExpandido(item.id);
      if (vozActiva) {
        // Lee TODO el contenido: título, cada subtítulo y cada viñeta
        hablar(construirTextoVoz(item));
      }
    }
  };

  const leerGlosario = () => {
    if (!vozActiva) return;
    let texto = "Glosario de términos clave. ";
    glosario.forEach(g => {
      texto += `${g.termino}: ${g.definicion}. `;
    });
    hablar(texto);
  };

  return (
    <View style={styles.wrapper}>

      <TouchableOpacity
        style={styles.audioGlobal}
        onPress={toggleVoz}
        accessibilityLabel={vozActiva ? "Desactivar voz" : "Activar voz"}
      >
        <Text style={{ color: "#fff" }}>
          {vozActiva ? "🔊 Voz activada" : "🔇 Activar voz"}
        </Text>
      </TouchableOpacity>

      <LinearGradient colors={["#7B61FF", "#A78BFA"]} style={styles.header}>
        <Text style={styles.headerTitle}>🌎 Ciencias Sociales</Text>
        <Text style={styles.headerSub}>Toca un tema para expandirlo y escucharlo completo</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            🎧 Activa la voz para escuchar el contenido completo de cada tema
          </Text>
        </View>

        {contenidos.map((item, index) => (
          <View key={item.id} style={styles.temaCard}>

            <TouchableOpacity
              style={[styles.temaHeader, { borderLeftColor: item.color }]}
              onPress={() => toggleTema(item, index)}
              accessibilityLabel={`${posicionTema(index)}. ${item.titulo}. ${item.resumen}. Toca para ${expandido === item.id ? "cerrar" : "expandir y escuchar todo"}`}
            >
              <Text style={styles.temaIcono}>{item.icono}</Text>
              <View style={styles.temaInfoHeader}>
                <Text style={[styles.temaTitulo, { color: item.color }]}>{item.titulo}</Text>
                <Text style={styles.temaResumen}>{item.resumen}</Text>
              </View>
              <Text style={styles.chevron}>{expandido === item.id ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {expandido === item.id && (
              <View style={styles.temaContenido}>

                {/* Botón que lee TODO el contenido del tema */}
                <TouchableOpacity
                  style={[styles.btnReleer, { backgroundColor: item.color }]}
                  onPress={() => hablar(construirTextoVoz(item))}
                  accessibilityLabel="Escuchar todo el contenido de este tema de nuevo"
                >
                  <Text style={styles.btnReleerTexto}>🔊 Escuchar todo de nuevo</Text>
                </TouchableOpacity>

                {item.secciones.map((seccion, si) => (
                  <View key={si} style={styles.seccion}>

                    {/* Cada subtítulo también es tocable para leer solo esa sección */}
                    <TouchableOpacity
                      onPress={() => {
                        if (vozActiva) {
                          let texto = `${seccion.subtitulo}. `;
                          seccion.viñetas.forEach(v => { texto += `${v}. `; });
                          hablar(texto);
                        }
                      }}
                      accessibilityLabel={`Toca para escuchar la sección ${seccion.subtitulo}`}
                    >
                      <Text style={[styles.seccionTitulo, { color: item.color }]}>
                        {seccion.subtitulo} 🔊
                      </Text>
                    </TouchableOpacity>

                    {seccion.viñetas.map((v, vi) => (
                      <View key={vi} style={styles.viñetaFila}>
                        <View style={[styles.viñetaDot, { backgroundColor: item.color }]} />
                        <Text style={styles.viñetaTexto}>{v}</Text>
                      </View>
                    ))}
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.btnPracticar}
                  onPress={() => {
                    if (vozActiva) hablar("Abriendo práctica de Ciencias Sociales");
                    navigation.navigate("Quiz", { materia: "sociales" });
                  }}
                  accessibilityLabel="Practicar preguntas de este tema"
                >
                  <Text style={styles.btnPracticarTexto}>📝 Practicar preguntas</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* GLOSARIO */}
        <View style={styles.glosarioCard}>
          <TouchableOpacity
            onPress={leerGlosario}
            accessibilityLabel="Glosario de términos clave, toca para escuchar todas las definiciones"
          >
            <Text style={styles.glosarioTitulo}>🎧 Glosario de términos clave</Text>
            <Text style={styles.glosarioSub}>Toca para escuchar todas las definiciones</Text>
          </TouchableOpacity>

          {glosario.map((g, gi) => (
            <TouchableOpacity
              key={gi}
              style={styles.glosarioItem}
              onPress={() => {
                if (vozActiva) hablar(`${g.termino}: ${g.definicion}`);
              }}
              accessibilityLabel={`${g.termino}: ${g.definicion}. Toca para escuchar`}
            >
              <View style={styles.glosarioTerminoFila}>
                <View style={styles.glosarioDot} />
                <Text style={styles.glosarioTermino}>{g.termino}</Text>
              </View>
              <Text style={styles.glosarioDefinicion}>{g.definicion}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    ...(Platform.OS === "web" ? { height: "100vh", overflow: "hidden" } : {})
  },
  audioGlobal: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    zIndex: 10
  },
  header: {
    padding: 25,
    paddingTop: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexShrink: 0
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerSub: { color: "#ddd", fontSize: 13, marginTop: 5 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, flexGrow: 1 },
  tip: {
    backgroundColor: "#EEF0FF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#7B61FF"
  },
  tipText: { color: "#555", fontSize: 13, lineHeight: 20 },
  temaCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
    overflow: "hidden"
  },
  temaHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderLeftWidth: 5,
    gap: 12
  },
  temaIcono: { fontSize: 28 },
  temaInfoHeader: { flex: 1 },
  temaTitulo: { fontSize: 15, fontWeight: "bold" },
  temaResumen: { fontSize: 12, color: "#888", marginTop: 3 },
  chevron: { fontSize: 14, color: "#AAA" },
  temaContenido: { padding: 16, borderTopWidth: 1, borderTopColor: "#F0F0F0" },
  btnReleer: {
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 16
  },
  btnReleerTexto: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  seccion: { marginBottom: 16 },
  seccionTitulo: { fontSize: 14, fontWeight: "bold", marginBottom: 8 },
  viñetaFila: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6, gap: 8 },
  viñetaDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, flexShrink: 0 },
  viñetaTexto: { fontSize: 14, color: "#444", lineHeight: 21, flex: 1 },
  btnPracticar: {
    marginTop: 8,
    backgroundColor: "#7B61FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  btnPracticarTexto: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  glosarioCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#FF9800"
  },
  glosarioTitulo: { fontSize: 16, fontWeight: "bold", color: "#FF9800" },
  glosarioSub: { fontSize: 12, color: "#888", marginTop: 4, marginBottom: 14 },
  glosarioItem: { marginBottom: 12 },
  glosarioTerminoFila: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  glosarioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF9800", flexShrink: 0 },
  glosarioTermino: { fontWeight: "bold", color: "#FF9800", fontSize: 14 },
  glosarioDefinicion: { fontSize: 13, color: "#555", lineHeight: 19, paddingLeft: 16 }
});