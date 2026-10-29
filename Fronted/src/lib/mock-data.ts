import { GuiaVisual, Cita, Documento, AuditLog, UserProfile } from "@/types";

export const MOCK_USERS: UserProfile[] = [
  {
    id: "usr-ciudadano-001",
    email: "ciudadano.cochabamba@gmail.com",
    fullName: "Carlos Mamani Torrico",
    role: "ciudadano",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
    phone: "+591 71458920",
    ci: "6548912 Cbba.",
    department: "Cochabamba",
    createdAt: "2026-01-15T09:30:00Z",
  },
  {
    id: "usr-abogado-002",
    email: "dra.soliz.abogada@gmail.com",
    fullName: "Dra. Valeria Soliz Guzmán",
    role: "abogado",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
    phone: "+591 79712345",
    ci: "4823901 Cbba.",
    department: "Cochabamba",
    createdAt: "2025-11-20T14:00:00Z",
  },
  {
    id: "usr-admin-003",
    email: "admin.legal@cochabamba.gob.bo",
    fullName: "Lic. Fernando Rocha Vargas",
    role: "administrador",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
    phone: "+591 70788990",
    ci: "3910245 Cbba.",
    department: "Cochabamba",
    createdAt: "2025-08-10T10:15:00Z",
  },
];

export const MOCK_GUIAS: GuiaVisual[] = [
  {
    id: "guia-ddrr-compraventa",
    slug: "inscripcion-compraventa-derechos-reales",
    titulo: "Inscripción de Inmueble y Folio Real",
    descripcionCorta:
      "Guía paso a paso para inscribir la compraventa de una casa o lote en Derechos Reales Cochabamba y obtener el Folio Real oficial.",
    descripcionLarga:
      "El registro en Derechos Reales otorga seguridad jurídica a tu propiedad frente a terceros. En Cochabamba, este trámite se realiza en las oficinas de Derechos Reales (Edificio de Tribunales de Justicia o distritales) tras haber pagado el Impuesto Municipal a las Transferencias (IMT) en la Alcaldía (GAMC).",
    categoria: "inmuebles",
    entidadResponsable: "Oficina de Derechos Reales (DDRR) Cochabamba",
    ubicacionSede: "Av. Heroínas esq. San Martín, Edif. Órgano Judicial, Cochabamba",
    duracionEstimada: "15 a 25 días hábiles",
    costoTotalAproximadoBs: 450,
    dificultad: "Media",
    destacado: true,
    publicado: true,
    requisitosGenerales: [
      "Minuta de Compraventa protocolizada ante Notario de Fe Pública",
      "Testimonio de Propiedad original",
      "Formulario de pago del Impuesto Municipal a las Transferencias (IMT 3%) del GAMC",
      "Certificado Catastral actualizado emitido por la Alcaldía de Cochabamba",
      "Cédula de Identidad vigente del comprador y vendedor",
      "Plano aprobado y visado por la comuna correspondiente",
    ],
    pasos: [
      {
        numero: 1,
        titulo: "Minuta y Testimonio Notarial",
        resumenSimple:
          "Un abogado redacta el contrato de compraventa y luego un Notario de Fe Pública elabora el Testimonio oficial.",
        detalleLegal:
          "Elaboración de Minuta traslativa de dominio conforme al Código Civil Art. 491, protocolización notarial y emisión del Testimonio original con valores notariales vigentes.",
        entidad: "Notaría de Fe Pública (Cochabamba)",
        duracionEstimada: "2 a 3 días hábiles",
        costoBs: 250,
        requisitosClave: [
          "Cédulas de Identidad originales",
          "Testimonio anterior del vendedor",
          "Folio Real actualizado con vigencia no mayor a 90 días",
        ],
        requisitosAdicionales: [
          "Plano catastral visado",
          "Boleta de pago de impuestos anuales sin adeudos",
        ],
        consejoPractico:
          "Verifica antes de firmar que el vendedor figure como propietario único en el Folio Real y que no tenga gravámenes o hipotecas activas.",
      },
      {
        numero: 2,
        titulo: "Pago del Impuesto IMT en GAMC",
        resumenSimple:
          "Pagar el 3% del valor catastral o de venta en las cajas del Gobierno Autónomo Municipal de Cochabamba.",
        detalleLegal:
          "Liquidación del Impuesto Municipal a las Transferencias (IMT) regulado por la Ley 843 y ordenanzas del GAMC en recaudaciones (Plaza Colón o Comunas).",
        entidad: "Alcaldía de Cochabamba (GAMC - Recaudaciones Plaza Colón)",
        duracionEstimada: "1 a 2 días hábiles",
        costoBs: 150,
        requisitosClave: [
          "Minuta original de compraventa",
          "Última proforma de catastro municipal",
        ],
        requisitosAdicionales: [
          "Copia de C.I. de ambas partes",
          "Impuestos de las últimas 5 gestiones canceladas",
        ],
        consejoPractico:
          "Tienes 10 días hábiles posteriores a la minuta para pagar el IMT sin multas por mora.",
        alertaImportante:
          "El trámite de IMT requiere que el predio no tenga deudas tributarias pendientes con la Comuna.",
      },
      {
        numero: 3,
        titulo: "Ingreso de Carpeta en Derechos Reales",
        resumenSimple:
          "Presentar la carpeta legal completa en ventanilla de Derechos Reales para revisión de título.",
        detalleLegal:
          "Presentación del Testimonio Notarial, Formulario IMT, Certificado Catastral y pago de aranceles judiciales según arancel del Consejo de la Magistratura.",
        entidad: "Derechos Reales Cochabamba (Av. San Martín / Heroínas)",
        duracionEstimada: "10 a 15 días hábiles",
        costoBs: 50,
        requisitosClave: [
          "Testimonio notarial original + 2 copias legalizadas",
          "Formulario IMT pagado",
          "Cédula de Identidad del solicitante",
        ],
        requisitosAdicionales: [
          "Carátula notarial sellada",
          "Certificado catastral actualizado",
        ],
        consejoPractico:
          "Guarda con mucho cuidado el talón con el número de matrícula y código de seguimiento para consultar el estado en línea.",
      },
      {
        numero: 4,
        titulo: "Retiro del Folio Real a tu Nombre",
        resumenSimple:
          "Recoger el Folio Real oficial que certifica que el inmueble ya está a tu nombre.",
        detalleLegal:
          "Verificación del asiento registral en la Subinscripción 'A' (Titularidad de Dominio), firma en libro de entrega y recojo del Folio Real en hoja de seguridad valorada.",
        entidad: "Derechos Reales Cochabamba",
        duracionEstimada: "1 día hábil",
        costoBs: 0,
        requisitosClave: [
          "Talón de ingreso original",
          "Cédula de Identidad original del titular o apoderado",
        ],
        consejoPractico:
          "Revisa de inmediato en ventanilla que tu nombre, número de C.I. y superficie en metros cuadrados no tengan errores ortográficos o numéricos.",
      },
    ],
    flujoDiagrama: {
      nodes: [
        {
          id: "node-1",
          position: { x: 250, y: 0 },
          data: {
            label: "Inicio del Trámite",
            tipo: "inicio",
            description: "Acuerdo de partes y verificación de antecedentes",
            entidad: "Partes interesadas",
          },
        },
        {
          id: "node-2",
          position: { x: 250, y: 120 },
          data: {
            label: "1. Notaría de Fe Pública",
            tipo: "paso",
            description: "Elaboración de Minuta y Testimonio Notarial",
            entidad: "Notaría Cochabamba",
            duracion: "2 a 3 días",
            costo: "Bs. 250",
          },
        },
        {
          id: "node-3",
          position: { x: 250, y: 250 },
          data: {
            label: "2. Liquidación IMT (GAMC)",
            tipo: "paso",
            description: "Pago del 3% en Recaudaciones Municipales",
            entidad: "GAMC Plaza Colón",
            duracion: "1 a 2 días",
            costo: "3% catastral",
          },
        },
        {
          id: "node-4",
          position: { x: 250, y: 380 },
          data: {
            label: "¿Documentación Observada?",
            tipo: "decision",
            description: "Revisión técnica de linderos y titularidad",
            entidad: "DDRR Ventanilla",
          },
        },
        {
          id: "node-4-subanar",
          position: { x: 520, y: 380 },
          data: {
            label: "Subsanación de Observaciones",
            tipo: "paso",
            description: "Aclaratoria de linderos o datos ante Notario",
            entidad: "Notaría / GAMC",
          },
        },
        {
          id: "node-5",
          position: { x: 250, y: 510 },
          data: {
            label: "3. Registro y Asiento Registral",
            tipo: "paso",
            description: "Inscripción en base de datos de DDRR",
            entidad: "Registrador DDRR",
            duracion: "10 días",
          },
        },
        {
          id: "node-6",
          position: { x: 250, y: 640 },
          data: {
            label: "Folio Real Emitido",
            tipo: "fin",
            description: "Entrega del documento de propiedad definitivo",
            entidad: "Ventanilla DDRR",
          },
        },
      ],
      edges: [
        { id: "e1-2", source: "node-1", target: "node-2", animated: true },
        { id: "e2-3", source: "node-2", target: "node-3", animated: true },
        { id: "e3-4", source: "node-3", target: "node-4", animated: true },
        {
          id: "e4-subs",
          source: "node-4",
          target: "node-4-subanar",
          label: "Si hay observaciones",
        },
        {
          id: "e-subs-4",
          source: "node-4-subanar",
          target: "node-4",
          label: "Carpeta corregida",
        },
        {
          id: "e4-5",
          source: "node-4",
          target: "node-5",
          label: "Aprobado sin observaciones",
          animated: true,
        },
        { id: "e5-6", source: "node-5", target: "node-6", animated: true },
      ],
    },
    faq: [
      {
        pregunta: "¿Qué hago si mi vendedor no tiene Folio Real y solo tiene Título ejecutorial?",
        respuesta:
          "Si el predio proviene de dotación agraria o INRA, primero se debe tramitar la conversión o registro inicial ante DDRR con la Resolución Final de Saneamiento.",
      },
      {
        pregunta: "¿Puedo hacer este trámite con un poder notarial?",
        respuesta:
          "Sí, siempre que el poder notarial sea expreso para compraventa o registro de inmuebles y esté debidamente revistado en el Sistema del Notariado Plurinacional (SIMNOT).",
      },
    ],
  },
  {
    id: "guia-asistencia-familiar",
    slug: "demanda-asistencia-familiar-cochabamba",
    titulo: "Fijación y Cobro de Asistencia Familiar",
    descripcionCorta:
      "Aprende cómo solicitar la asistencia familiar para tus hijos en Cochabamba: cálculo del monto mínimo, presentación de demanda y depósito en cuenta judicial.",
    descripcionLarga:
      "La Asistencia Familiar es un derecho irrenunciable de niños, niñas y adolescentes establecido en el Código de las Familias (Ley 603). En Bolivia, el monto mínimo legal equivale al 20% del Salario Mínimo Nacional por cada hijo. En Cochabamba se tramita ante los Juzgados Públicos de Familia del Tribunal Departamental de Justicia.",
    categoria: "familia",
    entidadResponsable: "Tribunal Departamental de Justicia de Cochabamba (Juzgados de Familia)",
    ubicacionSede: "Av. San Martín y Jordán, Edificio Judicial Cochabamba",
    duracionEstimada: "1 a 3 meses (Medida cautelar inmediata)",
    costoTotalAproximadoBs: 80,
    dificultad: "Baja",
    destacado: true,
    publicado: true,
    requisitosGenerales: [
      "Certificado de Nacimiento original del hijo/a (emitido por SERECI)",
      "Cédula de Identidad del progenitor solicitante",
      "Croquis del domicilio del demandado y lugar de trabajo",
      "Comprobantes de gastos del menor (salud, educación, alimentación)",
      "Número de cuenta bancaria en el Banco Unión para depósitos judiciales",
    ],
    pasos: [
      {
        numero: 1,
        titulo: "Reunión de Documentación y Certificados",
        resumenSimple:
          "Obtener el certificado de nacimiento del hijo en SERECI y armar la lista de gastos mensuales del menor.",
        detalleLegal:
          "Acreditación de la filiación conforme al Art. 116 de la Ley 603, comprobantes idóneos de escolaridad, salud y recreación para fundamentar las necesidades del beneficiario.",
        entidad: "SERECI Cochabamba (Av. Simón López / Cine Center)",
        duracionEstimada: "1 día hábil",
        costoBs: 30,
        requisitosClave: [
          "Certificado de Nacimiento emitido por SERECI",
          "Copia de C.I. de la madre o padre demandante",
        ],
        requisitosAdicionales: [
          "Boletas de matrícula escolar o pensión",
          "Recetas o certificados médicos en caso de requerimientos especiales",
        ],
        consejoPractico:
          "Si no tienes recursos para un abogado privado, puedes acudir a la Defensoría de la Niñez y Adolescencia del GAMC o a los Servicios Legales Integrales Municipales (SLIM).",
      },
      {
        numero: 2,
        titulo: "Presentación de Demanda o Acuerdo Conciliatorio",
        resumenSimple:
          "Ingresar el memorial al juzgado o acudir a una audiencia de conciliación pacífica.",
        detalleLegal:
          "Presentación del memorial ante Plataforma de Atención al Público e Ingreso de Causas del TDJ Cochabamba o suscripción de acta conciliatoria prejudicial homologada.",
        entidad: "Juzgados Públicos de Familia (TDJ Cochabamba)",
        duracionEstimada: "5 a 10 días hábiles",
        costoBs: 50,
        requisitosClave: [
          "Memorial de demanda firmado por abogado o Defensoría",
          "Croquis claro de ubicación del demandado para la citación",
        ],
        requisitosAdicionales: [
          "Datos laborales o de ingresos estimados del obligado",
        ],
        consejoPractico:
          "El juez suele fijar una 'Asistencia Familiar Provisional' desde el primer auto de admisión mientras se resuelve la sentencia definitiva.",
        alertaImportante:
          "El monto nunca puede ser menor al 20% del salario mínimo nacional vigente en Bolivia.",
      },
      {
        numero: 3,
        titulo: "Apertura de Cuenta y Cobro en Banco Unión",
        resumenSimple:
          "Se abre una cuenta judicial en Banco Unión donde el obligado deposita mensualmente.",
        detalleLegal:
          "Habilitación de cuenta judicial de Asistencia Familiar mediante orden judicial expresa en Banco Unión para control automatizado de depósitos.",
        entidad: "Banco Unión / Juzgado de Familia",
        duracionEstimada: "2 a 4 días",
        costoBs: 0,
        requisitosClave: [
          "Orden judicial de apertura de cuenta emitida por el juzgado",
          "Cédula de Identidad vigente",
        ],
        consejoPractico:
          "Guarda todos los comprobantes de depósito o descarga el extracto en línea para posibles liquidaciones futuras.",
      },
    ],
    flujoDiagrama: {
      nodes: [
        {
          id: "af-1",
          position: { x: 220, y: 0 },
          data: {
            label: "Inicio del Reclamo",
            tipo: "inicio",
            description: "Certificado de nacimiento y comprobantes",
            entidad: "Ciudadano / Menor",
          },
        },
        {
          id: "af-2",
          position: { x: 220, y: 120 },
          data: {
            label: "¿Existe Acuerdo Previo?",
            tipo: "decision",
            description: "¿Los padres pueden acordar el monto?",
            entidad: "Defensoría / Conciliación",
          },
        },
        {
          id: "af-3a",
          position: { x: 50, y: 250 },
          data: {
            label: "Acta de Conciliación",
            tipo: "paso",
            description: "Firma rápida y homologación ante el Juez",
            entidad: "Defensoría de la Niñez GAMC",
            duracion: "3 días",
            costo: "Gratuito",
          },
        },
        {
          id: "af-3b",
          position: { x: 400, y: 250 },
          data: {
            label: "Demanda Judicial Formal",
            tipo: "paso",
            description: "Citación, auto interlocutorio provisional",
            entidad: "Juzgado de Familia Cochabamba",
            duracion: "15 a 30 días",
            costo: "Bs. 50 arancel",
          },
        },
        {
          id: "af-4",
          position: { x: 220, y: 400 },
          data: {
            label: "Fijación de Monto Provisional",
            tipo: "paso",
            description: "Mínimo 20% Salario Mínimo Nacional por hijo",
            entidad: "Juez Público de Familia",
          },
        },
        {
          id: "af-5",
          position: { x: 220, y: 530 },
          data: {
            label: "Depósitos en Banco Unión",
            tipo: "fin",
            description: "Acreditación y cobro mensual automatizado",
            entidad: "Banco Unión / Cuenta Judicial",
          },
        },
      ],
      edges: [
        { id: "e-af1-2", source: "af-1", target: "af-2", animated: true },
        { id: "e-af2-3a", source: "af-2", target: "af-3a", label: "Sí (Mutuo acuerdo)" },
        { id: "e-af2-3b", source: "af-2", target: "af-3b", label: "No (Controversia)" },
        { id: "e-af3a-4", source: "af-3a", target: "af-4", animated: true },
        { id: "e-af3b-4", source: "af-3b", target: "af-4", animated: true },
        { id: "e-af4-5", source: "af-4", target: "af-5", animated: true },
      ],
    },
    faq: [
      {
        pregunta: "¿Qué pasa si el obligado no paga la asistencia familiar fijada?",
        respuesta:
          "Se solicita una 'Liquidación de Asistencia Familiar'. Si no cancela en 3 días tras la notificación, el juez emite Mandamiento de Apremio corporal (detención hasta 6 meses hasta el pago).",
      },
      {
        pregunta: "¿Hasta qué edad tienen derecho a recibir asistencia familiar los hijos?",
        respuesta:
          "Hasta los 18 años por minoría de edad, o hasta los 25 años si continúan estudios universitarios o técnicos con aprovechamiento comprobado.",
      },
    ],
  },
  {
    id: "guia-gamc-licencia",
    slug: "licencia-funcionamiento-gamc-cochabamba",
    titulo: "Licencia de Funcionamiento Municipal",
    descripcionCorta:
      "Pasos claros para tramitar la Licencia de Funcionamiento de tu negocio, tienda o emprendimiento ante la Alcaldía de Cochabamba.",
    descripcionLarga:
      "Todo establecimiento comercial, industrial o de servicios en el municipio de Cochabamba debe contar con su Licencia de Funcionamiento otorgada por el GAMC para operar legalmente y evitar clausuras o multas.",
    categoria: "municipal",
    entidadResponsable: "Gobierno Autónomo Municipal de Cochabamba (GAMC - Dirección de Recaudaciones)",
    ubicacionSede: "Plaza Colón esq. Baptista, Cochabamba",
    duracionEstimada: "7 a 15 días hábiles",
    costoTotalAproximadoBs: 120,
    dificultad: "Baja",
    destacado: true,
    publicado: true,
    requisitosGenerales: [
      "Cédula de Identidad del propietario o representante legal",
      "NIT (Número de Identificación Tributaria) del SIN",
      "Contrato de alquiler o Folio Real del inmueble donde funcionará",
      "Croquis de ubicación exacta del local comercial",
      "Certificado acústico o de medio ambiente (según el rubro)",
    ],
    pasos: [
      {
        numero: 1,
        titulo: "Verificación de Uso de Suelo y Zona",
        resumenSimple:
          "Consultar en la Comuna si la actividad comercial está permitida en esa zona de la ciudad.",
        detalleLegal:
          "Inspección de compatibilidad según el Plan de Ordenamiento Territorial y Catastro Urbano del GAMC.",
        entidad: "Subalcaldía / Comuna Municipal (Tunari, Adela Zamudio, Molle, etc.)",
        duracionEstimada: "2 días hábiles",
        costoBs: 20,
        requisitosClave: [
          "Croquis de ubicación del predio",
          "Fotocopia de C.I. del solicitante",
        ],
        requisitosAdicionales: [
          "Código catastral del inmueble",
        ],
        consejoPractico:
          "Verifica si tu negocio queda cerca de escuelas o centros de salud si comercializas bebidas o alimentos.",
      },
      {
        numero: 2,
        titulo: "Inspección Técnica de Seguridad (BOMBEROS / GAMC)",
        resumenSimple:
          "Revisión de extintor, botiquín y señalética de emergencia en el local.",
        detalleLegal:
          "Verificación de normas de salubridad e inocuidad conforme a ordenanza municipal y certificación de extintores.",
        entidad: "Intendencia Municipal / Dirección de Medio Ambiente GAMC",
        duracionEstimada: "3 a 5 días hábiles",
        costoBs: 50,
        requisitosClave: [
          "Extintor de polvo químico seco vigente (6kg o 10kg)",
          "Botiquín de primeros auxilios",
        ],
        requisitosAdicionales: [
          "Luces de emergencia operativas",
        ],
        consejoPractico:
          "Tener el extintor colgado en un lugar visible con su tarjeta de recarga actualizada facilita la aprobación en la primera visita.",
      },
      {
        numero: 3,
        titulo: "Emisión de Licencia y Cartón Oficial",
        resumenSimple:
          "Pago de valores y recojo del cartón con código QR para exhibir en tu negocio.",
        detalleLegal:
          "Registro en el Padrón Municipal de Contribuyentes y entrega de la Licencia con código QR de verificación de fiscalización.",
        entidad: "GAMC Recaudaciones (Plaza Colón)",
        duracionEstimada: "2 días hábiles",
        costoBs: 50,
        requisitosClave: [
          "Formulario único de trámite aprobado por la subalcaldía",
          "Comprobante de pago de arancel municipal",
        ],
        consejoPractico:
          "Plastifica el cartón y colócalo en un lugar visible junto a la puerta principal de tu negocio.",
      },
    ],
    flujoDiagrama: {
      nodes: [
        {
          id: "gamc-1",
          position: { x: 220, y: 0 },
          data: {
            label: "Inicio de Emprendimiento",
            tipo: "inicio",
            description: "Definición del local comercial y rubro",
            entidad: "Ciudadano",
          },
        },
        {
          id: "gamc-2",
          position: { x: 220, y: 120 },
          data: {
            label: "1. Consulta de Uso de Suelo",
            tipo: "paso",
            description: "Verificación en la Comuna correspondiente",
            entidad: "Subalcaldía Comunal",
            duracion: "2 días",
            costo: "Bs. 20",
          },
        },
        {
          id: "gamc-3",
          position: { x: 220, y: 250 },
          data: {
            label: "2. Inspección y Seguridad",
            tipo: "paso",
            description: "Extintor, botiquín y medidas de salubridad",
            entidad: "Intendencia GAMC",
            duracion: "3 a 5 días",
            costo: "Bs. 50",
          },
        },
        {
          id: "gamc-4",
          position: { x: 220, y: 380 },
          data: {
            label: "3. Pago y Emisión de Licencia QR",
            tipo: "fin",
            description: "Exhibición visible del cartón en el local",
            entidad: "Recaudaciones Plaza Colón",
            duracion: "2 días",
            costo: "Bs. 50",
          },
        },
      ],
      edges: [
        { id: "e-g1-2", source: "gamc-1", target: "gamc-2", animated: true },
        { id: "e-g2-3", source: "gamc-2", target: "gamc-3", animated: true },
        { id: "e-g3-4", source: "gamc-3", target: "gamc-4", animated: true },
      ],
    },
    faq: [
      {
        pregunta: "¿Cada cuánto tiempo se renueva la Licencia de Funcionamiento en Cochabamba?",
        respuesta:
          "Generalmente tiene una vigencia de 2 a 5 años dependiendo de la categoría comercial, requiriendo revalidación de datos tributarios anualmente.",
      },
    ],
  },
  {
    id: "guia-sereci-nacimiento",
    slug: "saneamiento-certificado-nacimiento-sereci",
    titulo: "Saneamiento y Certificado SERECI",
    descripcionCorta:
      "Corrección de errores en partidas de nacimiento, matrimonio o defunción y obtención de certificado duplicado en Cochabamba.",
    descripcionLarga:
      "El SERECI (Servicio de Registro Cívico) en Cochabamba administra el estado civil de las personas. Esta guía explica el procedimiento administrativo rápido para rectificar errores de letras o fechas en tu partida.",
    categoria: "identidad",
    entidadResponsable: "SERECI Cochabamba (Tribunal Electoral Departamental)",
    ubicacionSede: "Av. Simón López N° 1245 / Edificio Cine Center Cochabamba",
    duracionEstimada: "1 a 5 días hábiles",
    costoTotalAproximadoBs: 65,
    dificultad: "Baja",
    destacado: false,
    publicado: true,
    requisitosGenerales: [
      "Cédula de Identidad del interesado",
      "Libreta de Servicio Militar o Bautismo antigua que respalde la corrección",
      "Formulario de solicitud de saneamiento administrativo",
    ],
    pasos: [
      {
        numero: 1,
        titulo: "Búsqueda de Partida Original en Archivo",
        resumenSimple:
          "Solicitar la revisión del libro de partidas histórico para cotejar el error.",
        detalleLegal:
          "Verificación en el archivo biométrico y libros matrices de registro civil conforme a la Ley 018.",
        entidad: "SERECI Cochabamba",
        duracionEstimada: "1 día",
        costoBs: 25,
        requisitosClave: [
          "Cédula de Identidad",
          "Datos del año y oficialía donde se inscribió",
        ],
        consejoPractico:
          "Lleva copias antiguas de certificados escolares o de bautismo si el error es en el apellido materno o paterno.",
      },
      {
        numero: 2,
        titulo: "Resolución Administrativa de Corrección",
        resumenSimple:
          "El inspector emite la resolución que corrige la letra o fecha sin necesidad de juicio.",
        detalleLegal:
          "Emisión de Resolución Administrativa de Saneamiento conforme a la reglamentación del OEP.",
        entidad: "Dirección Departamental SERECI",
        duracionEstimada: "2 a 3 días",
        costoBs: 40,
        requisitosClave: [
          "Documento probatorio idóneo",
          "Formulario firmado",
        ],
        consejoPractico:
          "Una vez corregido, solicita de inmediato 2 certificados originales con el sello de resolución.",
      },
    ],
    flujoDiagrama: {
      nodes: [
        {
          id: "s-1",
          position: { x: 200, y: 0 },
          data: {
            label: "Detección de Error",
            tipo: "inicio",
            description: "Discrepancia en letras o fechas",
            entidad: "Ciudadano",
          },
        },
        {
          id: "s-2",
          position: { x: 200, y: 120 },
          data: {
            label: "Búsqueda en Archivo SERECI",
            tipo: "paso",
            description: "Cotejo de libro matriz histórico",
            entidad: "SERECI Simón López",
          },
        },
        {
          id: "s-3",
          position: { x: 200, y: 240 },
          data: {
            label: "Resolución de Saneamiento",
            tipo: "fin",
            description: "Certificado corregido y actualizado en sistema",
            entidad: "Oficialía de Registro Cívico",
          },
        },
      ],
      edges: [
        { id: "es1-2", source: "s-1", target: "s-2", animated: true },
        { id: "es2-3", source: "s-2", target: "s-3", animated: true },
      ],
    },
    faq: [
      {
        pregunta: "¿Cuándo se requiere un juicio ordinario en lugar de saneamiento administrativo?",
        respuesta:
          "Solo si existe cambio sustancial de filiación o doble partida con identidades incompatibles que afecten derechos sucesorios.",
      },
    ],
  },
];

export const MOCK_CITAS: Cita[] = [
  {
    id: "cita-cbba-101",
    usuarioId: "usr-ciudadano-001",
    nombreUsuario: "Carlos Mamani Torrico",
    abogadoId: "usr-abogado-002",
    nombreAbogado: "Dra. Valeria Soliz Guzmán",
    fecha: "2026-10-28",
    hora: "10:30",
    modalidad: "presencial",
    lugar: "Oficinas de Asesoría Legal (Av. Heroínas N° 450, Piso 2, Cochabamba)",
    materia: "Derechos Reales e Inmuebles",
    motivo: "Revisión previa de Testimonio de compraventa antes de ingresar carpeta a DDRR.",
    estado: "confirmada",
    notas: "Llevar Testimonio original y comprobante IMT.",
    creadoEn: "2026-10-20T11:00:00Z",
  },
  {
    id: "cita-cbba-102",
    usuarioId: "usr-ciudadano-001",
    nombreUsuario: "Carlos Mamani Torrico",
    abogadoId: "usr-abogado-002",
    nombreAbogado: "Dra. Valeria Soliz Guzmán",
    fecha: "2026-11-04",
    hora: "15:00",
    modalidad: "virtual",
    lugar: "Videollamada Google Meet (meet.google.com/leg-cbba-xyz)",
    materia: "Asistencia Familiar",
    motivo: "Orientación sobre cálculo de retroactivo y solicitud de retención judicial de sueldo.",
    estado: "pendiente",
    notas: "Se revisarán boletas de depósito de los últimos 6 meses.",
    creadoEn: "2026-10-22T08:45:00Z",
  },
];

export const MOCK_DOCUMENTOS: Documento[] = [
  {
    id: "doc-001",
    usuarioId: "usr-ciudadano-001",
    nombreArchivo: "Cedula_Identidad_Mamani.pdf",
    categoria: "Identidad",
    tamañoBytes: 1048576, // 1 MB
    tipoMime: "application/pdf",
    urlStorage: "https://example.com/storage/docs/ci_mamani.pdf",
    estado: "verificado",
    fechaSubida: "2026-10-18T14:20:00Z",
    descripcion: "Cédula de Identidad escaneada a color (anverso y reverso).",
  },
  {
    id: "doc-002",
    usuarioId: "usr-ciudadano-001",
    nombreArchivo: "Folio_Real_Matricula_301199002341.pdf",
    categoria: "Inmuebles",
    tamañoBytes: 2450000,
    tipoMime: "application/pdf",
    urlStorage: "https://example.com/storage/docs/folio_real.pdf",
    estado: "verificado",
    fechaSubida: "2026-10-19T09:10:00Z",
    descripcion: "Folio Real emitido por Derechos Reales Cochabamba con sello seco.",
  },
  {
    id: "doc-003",
    usuarioId: "usr-ciudadano-001",
    nombreArchivo: "Formulario_IMT_GAMC_2026.pdf",
    categoria: "Tributario Municipal",
    tamañoBytes: 890000,
    tipoMime: "application/pdf",
    urlStorage: "https://example.com/storage/docs/imt_gamc.pdf",
    estado: "en_revision",
    fechaSubida: "2026-10-21T16:30:00Z",
    descripcion: "Boleta de pago del impuesto municipal a la transferencia (3%).",
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "audit-001",
    usuario: "Carlos Mamani Torrico",
    email: "ciudadano.cochabamba@gmail.com",
    rol: "ciudadano",
    accion: "LOGIN_SUCCESS",
    modulo: "Autenticación",
    detalles: "Inicio de sesión exitoso vía Google OAuth 2.0 (Supabase)",
    ip: "190.186.20.14 (Cochabamba, BO)",
    fecha: "2026-10-23 20:45:12",
  },
  {
    id: "audit-002",
    usuario: "Carlos Mamani Torrico",
    email: "ciudadano.cochabamba@gmail.com",
    rol: "ciudadano",
    accion: "CHATBOT_QUERY",
    modulo: "Chatbot Legal",
    detalles: "Consulta jurídica sobre requisitos de Derechos Reales Cochabamba",
    ip: "190.186.20.14 (Cochabamba, BO)",
    fecha: "2026-10-23 20:48:30",
  },
  {
    id: "audit-003",
    usuario: "Dra. Valeria Soliz Guzmán",
    email: "dra.soliz.abogada@gmail.com",
    rol: "abogado",
    accion: "CITA_CONFIRMADA",
    modulo: "Gestión de Citas",
    detalles: "Confirmación de cita presencial con Carlos Mamani para el 28/10/2026",
    ip: "181.115.14.88 (Cochabamba, BO)",
    fecha: "2026-10-23 20:52:10",
  },
  {
    id: "audit-004",
    usuario: "Lic. Fernando Rocha Vargas",
    email: "admin.legal@cochabamba.gob.bo",
    rol: "administrador",
    accion: "GUIA_ACTUALIZADA",
    modulo: "Administración de Guías",
    detalles: "Actualización de aranceles vigentes GAMC para Licencia de Funcionamiento",
    ip: "200.87.120.5 (Cochabamba, BO)",
    fecha: "2026-10-23 21:05:00",
  },
];
