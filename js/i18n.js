/**
 * Small, dependency-free translator for the static demo.
 * Text nodes are kept in English so changing language is reversible, including
 * content injected later by the calculator, watch, and lab components.
 */
(function () {
    const translations = {
        "GPS Demystified": "GPS explicado",
        "The Science": "La ciencia", "3D Globe": "Globo 3D", "Smartwatch Feed": "Datos del reloj",
        "The Math Animation": "Animación matemática", "Interactive Lab": "Laboratorio interactivo",
        "Physics & Mathematics in Action": "Física y matemáticas en acción",
        "How GPS Finds You on Earth": "Cómo te encuentra el GPS en la Tierra",
        "An interactive, step-by-step exploration of radio waves, atomic clocks, and 3D spherical trilateration for secondary science students.": "Una exploración interactiva, paso a paso, de ondas de radio, relojes atómicos y trilateración esférica 3D para estudiantes de secundaria.",
        "The Science & Equations Behind GPS": "La ciencia y las ecuaciones del GPS",
        "The 3D Earth & Satellite Constellation": "La Tierra 3D y la constelación de satélites",
        "What the Smartwatch Is Receiving": "Lo que recibe el reloj inteligente",
        "How the Watch Calculates Your Coordinates": "Cómo calcula el reloj tus coordenadas",
        "Interactive GPS Equation Lab": "Laboratorio interactivo de ecuaciones GPS",
        "Current Receiver Position": "Posición actual del receptor", "Target Coordinates": "Coordenadas objetivo",
        "Language": "Idioma",
        "Jump to City Preset": "Ir a una ciudad", "-- Select a City --": "-- Selecciona una ciudad --",
        "Madrid, Spain": "Madrid, España", "London, UK": "Londres, Reino Unido",
        "New York, USA": "Nueva York, EE. UU.", "Tokyo, Japan": "Tokio, Japón",
        "Sydney, Australia": "Sídney, Australia", "Cairo, Egypt": "El Cairo, Egipto",
        "Rio de Janeiro, Brazil": "Río de Janeiro, Brasil", "Quito, Ecuador (Equator)": "Quito, Ecuador (ecuador)",
        "Acquire 4 Satellites & Beam Signals": "Adquirir 4 satélites y emitir señales",
        "Satellites Deployed & Beaming": "Satélites desplegados y transmitiendo",
        "GPS Demonstration for Secondary Science": "Demostración de GPS para ciencias de secundaria",
        "Zero build dependencies": "Sin dependencias de compilación", "Built with HTML5, CSS3, and Three.js": "Creado con HTML5, CSS3 y Three.js",
        "Signal Travel Time (Time of Flight)": "Tiempo de viaje de la señal",
        "Calculating Distance (Pseudorange)": "Cálculo de distancia (pseudodistancia)",
        "3D Sphere Equation (Satellite 1)": "Ecuación de esfera 3D (satélite 1)",
        "4th Satellite Clock Bias Correction": "Corrección del reloj con el 4.º satélite",
        "Converting to Latitude & Longitude": "Conversión a latitud y longitud",
        "Equation": "Ecuación", "Step": "Paso", "of": "de",
        "Pause": "Pausar", "Auto-Play Steps": "Reproducir pasos automáticamente",
        "Clear Slots": "Limpiar casillas", "SOLVE!": "¡RESOLVER!", "Order Verified": "Orden verificado",
        "Incorrect Order - Check Slots": "Orden incorrecto: revisa las casillas", "Next Equation": "Siguiente ecuación",
        "True Ground Fix": "Posición real en tierra", "RECEIVER ANTENNA STATUS": "ESTADO DE LA ANTENA",
        "4 SATS LOCKED": "4 SATÉLITES FIJADOS", "SEARCHING...": "BUSCANDO...",
        "4/4 Satellites Locked": "4/4 satélites fijados", "Searching for Signal...": "Buscando señal...",
        "4/4 High GDOP Locked": "4/4 fijados (GDOP alto)", "Solution Type:": "Tipo de solución:",
        "Orbit Pos (ECEF):": "Posición orbital (ECEF):", "Broadcast (t": "Emisión (t",
        "Arrival (t": "Llegada (t", "Time Delta (&Delta;t):": "Diferencia de tiempo (&Delta;t):",
        "Speed of Light": "Velocidad de la luz", "Arrival Time": "Hora de llegada",
        "Broadcast Time": "Hora de emisión", "Time Delay": "Retraso temporal", "Earth Radius": "Radio terrestre",
        "Clock Bias": "Desfase del reloj", "Solved": "Resuelta", "Actual Math:": "Cálculo real:",
        "All 4 pseudoranges:": "Las 4 pseudodistancias:", "All satellite distances:": "Distancias de todos los satélites:",
        "Solved 3D Position:": "Posición 3D calculada:", "Candidate A — Earth surface": "Candidato A — superficie terrestre",
        "Candidate B — deep space": "Candidato B — espacio profundo", "KEEP": "CONSERVAR", "DISCARD": "DESCARTAR",
        "Empty": "Vacío", "Drop:": "Soltar:", "Remove": "Quitar", "Latitude": "Latitud", "Longitude": "Longitud",
        "Constellation:": "Constelación:", "Status:": "Estado:", "Operational": "Operativa"
        , "Section": "Sección", "Physics & Geometry": "Física y geometría",
        "Interactive 3D Demonstration": "Demostración 3D interactiva", "Telemetry Feed": "Datos de telemetría",
        "Step-by-Step Animation": "Animación paso a paso", "Hands-on Challenge": "Desafío práctico",
        "Physics, Geometry, and Telecommunications": "Física, geometría y telecomunicaciones",
        "How can your smartwatch or phone pinpoint your exact location in milliseconds using signals sent from satellites floating 20,200 km out in space? It all comes down to time, the speed of light, and geometry.": "¿Cómo puede tu reloj inteligente o teléfono localizarte con precisión en milisegundos usando señales enviadas desde satélites a 20.200 km de altura? Todo se reduce al tiempo, la velocidad de la luz y la geometría.",
        "GPS satellites broadcast high-frequency radio waves (part of the electromagnetic spectrum). Radio waves travel at the constant speed of light in vacuum and air:": "Los satélites GPS emiten ondas de radio de alta frecuencia, parte del espectro electromagnético. Las ondas de radio viajan a la velocidad constante de la luz en el vacío y en el aire:",
        "At this blazing speed, a signal travels all the way from orbit (~20,200 km) to your ground antenna in only about 0.067 seconds (67 milliseconds)!": "A esta velocidad vertiginosa, una señal viaja desde la órbita (~20.200 km) hasta tu antena terrestre en solo 0,067 segundos (67 milisegundos).",
        "Every satellite carries hyper-accurate atomic clocks (cesium/rubidium). The satellite sends out the exact moment the signal was transmitted (t_tx).": "Cada satélite lleva relojes atómicos de gran precisión (cesio/rubidio). El satélite transmite el instante exacto en que se envió la señal (t_tx).",
        "By subtracting transmission time from arrival time, the receiver computes the exact radial distance d to the satellite.": "Al restar la hora de transmisión de la hora de llegada, el receptor calcula la distancia radial exacta d al satélite.",
        "Knowing distance d to one satellite places you somewhere on the surface of a 3D sphere. In Cartesian space (X, Y, Z):": "Conocer la distancia d a un satélite te sitúa en algún punto de la superficie de una esfera 3D. En el espacio cartesiano (X, Y, Z):",
        "Measuring distances to multiple satellites allows us to find where their spheres intersect!": "Medir las distancias a varios satélites permite encontrar dónde se intersectan sus esferas.",
        "Many people say \"GPS triangulation\", but that is technically a misnomer! Triangulation measures angles (like a surveyor with a theodolite). GPS uses trilateration, measuring distances from time delays.": "Mucha gente dice «triangulación GPS», pero técnicamente es un nombre incorrecto. La triangulación mide ángulos, como un topógrafo con un teodolito. El GPS usa trilateración y mide distancias a partir de retrasos temporales.",
        "Mathematically, 3 spheres intersect at two points: one is right on Earth, and the other is tens of thousands of kilometers out in outer space! The receiver easily discards the space point. In real life, consumer watches don't have atomic clocks, so a 4th satellite is used to solve for receiver clock bias (Δt_clock).": "Matemáticamente, 3 esferas se intersectan en dos puntos: uno está sobre la Tierra y el otro se encuentra a decenas de miles de kilómetros en el espacio exterior. El receptor descarta fácilmente el punto espacial. En la vida real, los relojes de consumo no tienen relojes atómicos, por lo que se usa un cuarto satélite para resolver el desfase del reloj del receptor (Δt_clock).",
        "Drag the Earth to rotate. Click or tap anywhere on the globe to place your receiver location (snapped to whole degrees). Then press \"Acquire Satellites\" to launch 4 GPS satellites into space and beam squiggly radio wave signals down to your point!": "Arrastra la Tierra para girarla. Haz clic o toca cualquier lugar del globo para colocar la ubicación del receptor, redondeada a grados enteros. Después pulsa «Adquirir satélites» para lanzar 4 satélites GPS al espacio y emitir ondas de radio ondulantes hacia tu punto.",
        "Here is what the receiver computer inside a smartwatch actually \"hears\". Each satellite continuously transmits its identification number, orbital position (ephemeris), and atomic clock timestamp.": "Esto es lo que realmente «escucha» el ordenador receptor dentro de un reloj inteligente. Cada satélite transmite continuamente su número de identificación, su posición orbital (efemérides) y la marca de tiempo de su reloj atómico.",
        "At this blazing speed, a signal travels all the way from orbit (~20,200 km) to your ground antenna in only about ": "A esta velocidad vertiginosa, una señal viaja desde la órbita (~20.200 km) hasta tu antena terrestre en solo ",
        "0.067 seconds (67 milliseconds)": "0,067 segundos (67 milisegundos)",
        "Every satellite carries hyper-accurate ": "Cada satélite lleva ",
        "two points": "dos puntos", "4th satellite": "cuarto satélite",
        "angles": "ángulos", "trilateration": "trilateración", "distances": "distancias",
        "atomic clocks": "relojes atómicos de gran precisión",
        " (cesium/rubidium). The satellite sends out the exact moment the signal was transmitted (": " (cesio/rubidio). El satélite transmite el instante exacto en que se envió la señal (",
        "By subtracting transmission time from arrival time, the receiver computes the exact radial distance ": "Al restar la hora de transmisión de la hora de llegada, el receptor calcula la distancia radial exacta ",
        " to the satellite.": " al satélite.",
        "Knowing the distance ": "Conocer la distancia ",
        " to one satellite places you somewhere on the surface of a 3D sphere. In Cartesian space (": " a un satélite te sitúa en algún punto de la superficie de una esfera 3D. En el espacio cartesiano (",
        "Many people say \"GPS triangulation\", but that is technically a misnomer! Triangulation measures ": "Mucha gente dice «triangulación GPS», pero técnicamente es un nombre incorrecto. La triangulación mide ",
        " (like a surveyor with a theodolite). GPS uses ": " (como un topógrafo con un teodolito). El GPS usa ",
        ", measuring ": ", mide ",
        " from time delays.": " a partir de retrasos temporales.",
        "Many people say \"GPS triangulation\", but that is technically a misnomer! Triangulation measures angles (like a surveyor with a theodolite). GPS uses trilateration, measuring distances from time delays.": "Mucha gente dice «triangulación GPS», pero técnicamente es un nombre incorrecto. La triangulación mide ángulos, como un topógrafo con un teodolito. El GPS usa trilateración y mide distancias a partir de retrasos temporales.",
        " (and why we need a 4th in real life):": " (y por qué necesitamos un cuarto en la vida real):",
        "📦 Available Data Blocks (with real values):": "📦 Bloques de datos disponibles (con valores reales):",
        "Time Delta (Δt):": "Diferencia temporal (Δt):", "Delay (Δt):": "Retraso (Δt):",
        "Drag the Earth to rotate. Click or tap anywhere on the globe to place your receiver location (snapped to whole degrees). Then press ": "Arrastra la Tierra para girarla. Haz clic o toca cualquier lugar del globo para colocar la ubicación del receptor, redondeada a grados enteros. Después pulsa ",
        " to launch 4 GPS satellites into space and beam squiggly radio wave signals down to your point!": " para lanzar 4 satélites GPS al espacio y emitir ondas de radio ondulantes hacia tu punto.",
        "Mathematically, 3 spheres intersect at ": "Matemáticamente, 3 esferas se intersectan en ",
        ": one is right on Earth, and the other is tens of thousands of kilometers out in outer space! The receiver easily discards the space point. In real life, consumer watches don't have atomic clocks, so a ": ": uno está sobre la Tierra y el otro se encuentra a decenas de miles de kilómetros en el espacio exterior. El receptor descarta fácilmente el punto espacial. En la vida real, los relojes de consumo no tienen relojes atómicos, por lo que se usa un ",
        " is used to solve for receiver clock bias (": " para resolver el desfase del reloj del receptor (",
        "Follow the step-by-step animation below to see how raw millisecond time delays transform into intersecting spheres, eliminate false points, and pinpoint your whole-degree latitude and longitude!": "Sigue la animación paso a paso para ver cómo los retrasos temporales en milisegundos se transforman en esferas que se intersectan, eliminan los puntos falsos y determinan tu latitud y longitud en grados enteros.",
        "Drag or tap": "Arrastra o toca", "the telemetry data blocks": "los bloques de datos de telemetría",
        "into the equation slots.": "a las casillas de la ecuación.", "When the variables are in the right places,": "Cuando las variables están en los lugares correctos,",
        "Assemble the satellite equations yourself!": "¡Monta tú mismo las ecuaciones de los satélites!",
        " press ": " pulsa ",
        "to compute the live numbers and advance all the way to latitude and longitude!": "para calcular los valores reales y avanzar hasta la latitud y la longitud.",
        "This same measurement is repeated for all 4 satellites in the GPS lock.": "La misma medición se repite para los 4 satélites de la conexión GPS.",
        "Calculate Distances": "Calcular distancias", "Satellite 1": "Satélite 1", "Satellite 2": "Satélite 2",
        "Satellite 3": "Satélite 3", "Satellite 4": "Satélite 4", "Delay (&Delta;t):": "Retraso (&Delta;t):",
        "The 4 Pseudoranges": "Las 4 pseudodistancias",
        "First Sphere of Possibility": "Primera esfera de posibilidades",
        "Two Spheres Intersect in a Circle": "Dos esferas se intersectan en un círculo",
        "Three Spheres Intersect at 2 Points": "Tres esferas se intersectan en 2 puntos",
        "Clock Bias Correction & Final Coordinates": "Corrección del desfase y coordenadas finales",
        "Measuring time delays from 4 satellites traveling at the speed of light": "Medición de retrasos temporales de 4 satélites que viajan a la velocidad de la luz",
        "Distance from Satellite 1 defines a giant 3D spherical shell in space": "La distancia al satélite 1 define una enorme cáscara esférica 3D en el espacio",
        "Adding Satellite 2 cuts the possibilities down to a flat circular ring": "Añadir el satélite 2 reduce las posibilidades a un anillo circular plano",
        "Satellite 3 intersects the circle at exactly TWO points (Earth vs. Outer Space)": "El satélite 3 intersecta el círculo en exactamente DOS puntos (Tierra frente a espacio exterior)",
        "The 4th satellite solves for 4 unknowns (X, Y, Z, and Clock Error)!": "¡El cuarto satélite resuelve 4 incógnitas (X, Y, Z y desfase del reloj)!",
        "Each of the ": "Cada uno de los ",
        " carries an atomic clock and broadcasts its exact transmission timestamp (": " lleva un reloj atómico y transmite su marca de tiempo exacta (",
        "Your watch registers the arrival time (": "Tu reloj registra la hora de llegada (",
        "Radio waves travel at the speed of light (": "Las ondas de radio viajan a la velocidad de la luz (",
        "), giving 4 raw distances called ": "), lo que proporciona 4 distancias brutas llamadas ",
        "Why \"pseudoranges\"?": "¿Por qué «pseudodistancias»?",
        "Because your watch contains an inexpensive quartz clock with a slight unknown time error": "Porque tu reloj contiene un reloj de cuarzo económico con un pequeño error temporal desconocido",
        "A clock error of just 1 microsecond would throw position off by 300 meters!": "¡Un error de solo 1 microsegundo desviaría la posición 300 metros!",
        "We will use the 4th satellite to solve for this error.": "Usaremos el cuarto satélite para resolver este error.",
        "All points in space at this exact distance form a 3D sphere centered on Satellite 1.": "Todos los puntos del espacio a esta distancia exacta forman una esfera 3D centrada en el satélite 1.",
        "You could be anywhere on this sphere (in space, on the ground, or underground!).": "Podrías estar en cualquier punto de esta esfera (en el espacio, en tierra o bajo tierra).",
        "In 3D geometry, two intersecting spheres overlap along a": "En geometría 3D, dos esferas que se intersectan se solapan a lo largo de un",
        "flat 2D circle": "círculo 2D plano",
        "in space. We know for certain our location lies somewhere along the boundary of this ring!": "en el espacio. ¡Sabemos con certeza que nuestra ubicación está en algún punto del borde de este anillo!",
        "The 3rd sphere cuts through our circle at exactly ": "La tercera esfera atraviesa nuestro círculo en exactamente ",
        "One point is on Earth, but the second point is ~20,000 km out in outer space!": "Un punto está en la Tierra, pero el segundo se encuentra a unos 20.000 km, en el espacio exterior.",
        "However, we still have one crucial problem: our watch clock is not an atomic clock.": "Sin embargo, todavía tenemos un problema crucial: el reloj no es atómico.",
        "Here is where the ": "Aquí es donde el ",
        " solves the whole puzzle! We have 4 unknowns: 3 spatial coordinates (": " resuelve todo el problema. Tenemos 4 incógnitas: 3 coordenadas espaciales (",
        " plus the receiver clock bias (": " más el desfase del reloj del receptor (",
        "The 4th sphere will ONLY intersect the Earth point if ": "La cuarta esfera SOLO intersectará el punto terrestre si ",
        " is perfectly adjusted! By solving the system of 4 equations simultaneously:": " está perfectamente ajustado. Al resolver simultáneamente el sistema de 4 ecuaciones:",
        "for each satellite": "para cada satélite",
        "The watch corrects its quartz clock to atomic synchronization, eliminates the outer space point, and converts Cartesian ": "El reloj corrige su reloj de cuarzo para sincronizarlo con el tiempo atómico, elimina el punto del espacio exterior y convierte las coordenadas cartesianas ",
        " to your exact whole-degree geographic coordinates:": " en tus coordenadas geográficas exactas en grados enteros:",
        "Final Calculated Position:": "Posición final calculada:",
        "Clock Sync:": "Sincronización del reloj:",
        "Pseudorange Radius (d": "Radio de pseudodistancia (d",
        "Previous": "Anterior", "Reset": "Reiniciar", "Next Step": "Siguiente paso",
        "Title": "Título", "Subtitle": "Subtítulo",
        "3D Fix + Time Sync (4 Sats)": "Posición 3D + sincronización temporal (4 satélites)",
        "Time Delta (&Delta;t):": "Diferencia temporal (&Delta;t):",
        "Objective:": "Objetivo:", "Subtract the broadcast time from the arrival time for the satellite you are solving.": "Resta la hora de emisión de la hora de llegada del satélite que estás resolviendo.",
        "Drag or tap the boxes below with their actual numbers into the formula slots.": "Arrastra o toca las cajas con sus valores reales y colócalas en las casillas de la fórmula.",
        "AVAILABLE DATA BLOCKS (WITH REAL VALUES):": "BLOQUES DE DATOS DISPONIBLES (CON VALORES REALES):",
        "This same measurement": "Esta misma medición",
        "Satellite 1 X": "Posición X del satélite 1",
        "Satellite 1 Y": "Posición Y del satélite 1",
        "Satellite 1 Z": "Posición Z del satélite 1",
        "Click or tap the boxes below": "Haz clic o toca las cajas siguientes",
        "Next Equation (Stage": "Siguiente ecuación (etapa",
        "Practice Again": "Practicar de nuevo",
        "Click or tap": "Haz clic o toca", "to place your receiver location": "para colocar la ubicación del receptor",
        "Click": "Clic", "to place target": "para colocar el objetivo", "Wheel": "Rueda",
        "Left Click + Drag": "Clic izquierdo + arrastrar", "to rotate": "para girar", "to zoom": "para ampliar",
        "Notice how the 4 satellites spread out across the sky above your target.": "Observa cómo los 4 satélites se distribuyen por el cielo sobre tu objetivo.",
        "This wide angular separation (low GDOP) ensures accurate spherical intersections!": "Esta amplia separación angular (GDOP bajo) garantiza intersecciones esféricas precisas.",
        "The Speed of Light": "La velocidad de la luz", "Time-of-Flight Equation": "Ecuación del tiempo de vuelo",
        "Spherical Trilateration": "Trilateración esférica", "Trilateration vs. Triangulation": "Trilateración frente a triangulación",
        "The \"4th Satellite\" Mystery": "El misterio del «4.º satélite»",
        "Trilateration (Distances) vs. Triangulation (Angles):": "Trilateración (distancias) frente a triangulación (ángulos):",
        "Radio waves travel": "Las ondas de radio viajan", "Every satellite carries": "Cada satélite lleva",
        "Knowing distance": "Conocer la distancia", "Measuring distances": "Medir distancias",
        "Why 3 Satellites Give 2 Points": "Por qué 3 satélites dan 2 puntos",
        "Receiver Antenna Status": "Estado de la antena del receptor",
        "Click \"Acquire Satellites\"": "Haz clic en «Adquirir satélites»",
        "or tap the 3D Globe": "o toca el globo 3D", "to receive telemetry": "para recibir telemetría",
        "Follow the step-by-step animation": "Sigue la animación paso a paso",
        "Assemble the satellite equations yourself!": "¡Monta tú mismo las ecuaciones de los satélites!",
        "Next": "Siguiente", "Stage": "Etapa", "Equation 1 of 5": "Ecuación 1 de 5",
        "Equation 2 of 5": "Ecuación 2 de 5", "Equation 3 of 5": "Ecuación 3 de 5",
        "Equation 4 of 5": "Ecuación 4 de 5", "Equation 5 of 5": "Ecuación 5 de 5",
        "Step 1 of 5": "Paso 1 de 5", "Step 2 of 5": "Paso 2 de 5", "Step 3 of 5": "Paso 3 de 5",
        "Step 4 of 5": "Paso 4 de 5", "Step 5 of 5": "Paso 5 de 5",
        "Acquire Satellites": "Adquirir satélites", "Beaming": "Transmitiendo",
        "4 Satellite System Solved!": "¡Sistema de 4 satélites resuelto!", "Equation 1 Solved!": "¡Ecuación 1 resuelta!",
        "Equation 2 Solved!": "¡Ecuación 2 resuelta!", "Equation 3 Solved!": "¡Ecuación 3 resuelta!",
        "Equation 4 Solved!": "¡Ecuación 4 resuelta!", "Equation 5 Solved!": "¡Ecuación 5 resuelta!"
    };
    const originals = new WeakMap();
    function translate(value) {
        let result = value;
        Object.keys(translations).sort((a, b) => b.length - a.length).forEach(key => {
            result = result.split(key).join(translations[key]);
        });
        return result;
    }
    function apply() {
        const lang = localStorage.getItem('gps-language') || 'en';
        document.documentElement.lang = lang;
        document.title = lang === 'es'
            ? 'GPS explicado | Demostración de ciencia y matemáticas'
            : 'GPS Demystified | Secondary School Science & Math Demonstration';
        document.querySelectorAll('#language-select').forEach(select => { select.value = lang; });
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            if (!originals.has(node)) originals.set(node, node.nodeValue);
            node.nodeValue = lang === 'es' ? translate(originals.get(node)) : originals.get(node);
        }
        document.querySelectorAll('[title],[aria-label]').forEach(el => {
            ['title', 'aria-label'].forEach(attr => {
                const originalAttr = `data-i18n-${attr}`;
                if (!el.hasAttribute(originalAttr)) el.setAttribute(originalAttr, el.getAttribute(attr));
                const originalValue = el.getAttribute(originalAttr);
                if (lang === 'es') el.setAttribute(attr, translate(originalValue));
                else el.setAttribute(attr, originalValue);
            });
        });
    }
    window.t = key => (localStorage.getItem('gps-language') === 'es' ? (translations[key] || translate(key)) : key);
    window.gpsI18n = { apply };
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('#language-select').forEach(select => select.addEventListener('change', e => {
            localStorage.setItem('gps-language', e.target.value);
            window.location.reload();
        }));
        apply();
        new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
    });
})();
