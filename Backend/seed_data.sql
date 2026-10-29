-- =============================================================================
-- DATOS SEMILLA / EJEMPLO (SEED DATA)
-- Sistema de Asistencia Legal Visual - Cochabamba (Bolivia)
-- Ejecutar en el SQL Editor de Supabase
-- =============================================================================

-- =============================================================================
-- 1. FAQ LEGAL (Respuestas legales frecuentes de Cochabamba / Bolivia)
-- =============================================================================
INSERT INTO public.faq_legal (id, titulo, descripcion, respuesta, palabras_clave, categoria)
VALUES
(
    uuid_generate_v4(),
    '¿Cómo solicitar la asistencia familiar en Cochabamba?',
    'Monto mínimo, requisitos y juzgados competentes para la pensión alimenticia de hijos.',
    'La asistencia familiar se tramita ante los Juzgados Públicos de Familia (Tribunal Departamental de Justicia en Av. San Martín). El monto mínimo legal es el 20% del salario mínimo nacional vigente por hijo. Requisitos: Certificado de nacimiento original del menor, cédula de identidad del progenitor demandante y croquis del domicilio del demandado.',
    'pension alimenticia asistencia familiar hijos demanda juzgado familia salario minimo cochabamba menores manutencion',
    'Derecho de Familia'
),
(
    uuid_generate_v4(),
    'Requisitos para tramitar el divorcio notarial',
    'Vía rápida de desvinculación cuando hay mutuo acuerdo y sin hijos dependientes.',
    'El divorcio notarial procede cuando existe mutuo acuerdo, no hay hijos menores de edad ni bienes gananciales sujetos a división (o si los hay, ya cuentan con acuerdo regulador homologado). Requisitos: Certificado de matrimonio computarizado, certificados de no propiedad o acuerdo patrimonial, CIs vigentes de ambos cónyuges. Trámite ante cualquier Notaría de Fe Pública.',
    'divorcio notarial separacion mutuo acuerdo notaria matrimonio desvinculacion sin hijos',
    'Derecho de Familia'
),
(
    uuid_generate_v4(),
    '¿Qué hacer en caso de avasallamiento de terreno o lote?',
    'Medidas legales inmediatas y denuncia ante el INRA o juzgados agroambientales / penales.',
    'Si tu propiedad o lote fue avasallado en Sacaba, Quillacollo o Cercado: 1) No recurrir a la violencia. 2) Presentar denuncia inmediata ante la FELCC por Despojo y Perturbación de Posesión (Art. 351 C.P.). 3) En predios agrarios, acudir al Juzgado Agroambiental competente. Documentos indispensables: Folio Real original actualizado, plano aprobado y cédula de identidad.',
    'avasallamiento terreno lote despojo propiedad inmueble folio real inra desalojo cercado sacaba quillacollo',
    'Derecho Inmobiliario / Penal'
),
(
    uuid_generate_v4(),
    '¿Cómo registrar un inmueble en Derechos Reales (DDRR)?',
    'Pasos para inscribir compraventa de casa o terreno en Derechos Reales Cochabamba.',
    'Para registrar la transferencia de un inmueble en Derechos Reales (Oficina Central Calle San Martín esq. Jordán): 1) Escritura Pública de Compraventa protocolizada ante Notario. 2) Pago del Impuesto a la Transferencia (IMT 3%) en la Alcaldía correspondiente. 3) Certificado Catastral y Plano Aprobado. 4) Cédulas de identidad de comprador y vendedor. Se genera folio real con matrícula a nombre del nuevo titular.',
    'derechos reales ddrr folio real compraventa minuta inscripcion catastro impuesto transferencia alcaldia',
    'Derecho Inmobiliario'
),
(
    uuid_generate_v4(),
    '¿Qué hacer ante un despido intempestivo o injustificado?',
    'Derechos laborales, beneficios sociales y denuncia ante la Jefatura Departamental de Trabajo.',
    'El trabajador despedido sin causa justificada puede optar por la reincorporación laboral o el cobro de beneficios sociales (desahucio equivalente a 3 sueldos, indemnización por tiempo de servicios, aguinaldo y vacaciones pendientes). Debe acudir dentro de los 30 días a la Jefatura Departamental de Trabajo (Calle Antezana entre Colombia y Ecuador) para solicitar citación.',
    'despido intempestivo renuncia beneficios sociales desahucio jefatura trabajo finiquito indemnizacion sueldo liquidacion',
    'Derecho Laboral'
),
(
    uuid_generate_v4(),
    '¿Cómo tramitar la Declaratoria de Herederos (Aceptación de Herencia)?',
    'Procedimiento voluntario notarial para suceder bienes de una persona fallecida.',
    'La Aceptación de Herencia se realiza directamente ante Notaría de Fe Pública (sin necesidad de juicio). Requisitos: Certificado de defunción original computarizado, certificados de nacimiento que demuestren parentesco (hijos, cónyuge, padres), cédulas de identidad de los herederos y certificado de descendencia emitido por el SERECI.',
    'herencia declaratoria herederos aceptacion notario fallecimiento defuncion sucesion sereci',
    'Derecho Civil / Sucesiones'
)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- 2. GUÍAS VISUALES DE TRÁMITES (Para Cochabamba)
-- Compatible con tu tabla guias_visuales
-- =============================================================================
INSERT INTO public.guias_visuales (
    id,
    slug,
    titulo,
    descripcion_corta,
    descripcion_larga,
    categoria,
    entidad_responsable,
    ubicacion_sede,
    duracion_estimada,
    costo_total_aproximado_bs,
    dificultad,
    destacado,
    publicado,
    requisitos_generales,
    pasos,
    flujo_diagrama,
    faq
)
VALUES
(
    'guia-asistencia-fam',
    'tramite-asistencia-familiar-cochabamba',
    'Demanda de Asistencia Familiar',
    'Guía visual paso a paso para fijar o demandar la pensión alimenticia de tus hijos en Cochabamba.',
    'Procedimiento ordinario ante juzgados de familia para asegurar la manutención, educación, salud y vivienda de niños y adolescentes de acuerdo al Código de las Familias (Ley 603).',
    'Familia',
    'Tribunal Departamental de Justicia de Cochabamba',
    'Av. San Martín y Calle Jordán (Palacio de Justicia)',
    '15 a 45 días hábiles',
    150.00,
    'Media',
    true,
    true,
    '[
        "Certificado de nacimiento original computarizado del menor",
        "Cédula de Identidad del progenitor solicitante (fotocopia y original)",
        "Croquis de ubicación del domicilio y trabajo del obligado",
        "Facturas o recibos que demuestren gastos del menor (salud, colegio)"
    ]'::jsonb,
    '[
        {"orden": 1, "titulo": "Recolección de documentos", "detalle": "Obtener certificados en SERECI y armar carpeta con gastos."},
        {"orden": 2, "titulo": "Presentación de memorial", "detalle": "Patrocinio con abogado particular o Defensa Pública (SIJPLU)."},
        {"orden": 3, "titulo": "Fijación provisional", "detalle": "El Juez fija una asistencia provisional inmediata al admitir la demanda."},
        {"orden": 4, "titulo": "Audiencia y sentencia", "detalle": "Se determina el monto definitivo y depósito mensual en cuenta bancaria judicial."}
    ]'::jsonb,
    '{"nodes": [{"id": "1", "label": "Documentación"}, {"id": "2", "label": "Demanda"}, {"id": "3", "label": "Pensión Provisional"}, {"id": "4", "label": "Sentencia"}], "edges": [{"from": "1", "to": "2"}, {"from": "2", "to": "3"}, {"from": "3", "to": "4"}]}'::jsonb,
    '[
        {"pregunta": "¿Qué pasa si no tiene trabajo formal?", "respuesta": "Se calcula sobre el Salario Mínimo Nacional presumiendo ingresos mínimos."}
    ]'::jsonb
),
(
    'guia-registro-ddrr',
    'registro-propiedad-derechos-reales',
    'Inscripción de Inmueble en Derechos Reales',
    'Cómo obtener tu Folio Real definitivo tras comprar un lote o departamento en Cochabamba.',
    'Procedimiento de registro definitivo para oponibilidad frente a terceros y seguridad jurídica de tu derecho propietario.',
    'Inmobiliario',
    'Consejo de la Magistratura - Derechos Reales Cochabamba',
    'Calle San Martín entre Jordán y Calama',
    '10 a 20 días hábiles',
    420.00,
    'Alta',
    true,
    true,
    '[
        "Escritura Pública Notariada de Compraventa (Testimonio)",
        "Comprobante de pago de Impuesto a la Transferencia (IMT Alcaldía)",
        "Plano catastral aprobado con código catastral",
        "Cédula de Identidad del nuevo propietario"
    ]'::jsonb,
    '[
        {"orden": 1, "titulo": "Protocolización notarial", "detalle": "Elevar la minuta a Escritura Pública ante Notaría de Fe Pública."},
        {"orden": 2, "titulo": "Visación municipal", "detalle": "Pagar el 3% IMT y registrar datos catastrales en la Alcaldía."},
        {"orden": 3, "titulo": "Ingreso a Derechos Reales", "detalle": "Comprar valoradas y presentar en ventanilla rápida de DDRR."},
        {"orden": 4, "titulo": "Entrega de Folio Real", "detalle": "Recepción del folio con código QR y número de matrícula único."}
    ]'::jsonb,
    '{"nodes": [{"id": "1", "label": "Notaría"}, {"id": "2", "label": "Alcaldía (IMT)"}, {"id": "3", "label": "Ingreso DDRR"}, {"id": "4", "label": "Folio Real"}], "edges": [{"from": "1", "to": "2"}, {"from": "2", "to": "3"}, {"from": "3", "to": "4"}]}'::jsonb,
    '[
        {"pregunta": "¿Puedo registrar un lote sin planos aprobados?", "respuesta": "No, Derechos Reales exige visación técnica municipal vigente."}
    ]'::jsonb
),
(
    'guia-denuncia-laboral',
    'denuncia-despido-ministerio-trabajo',
    'Cobro de Finiquito y Denuncia Laboral',
    'Pasos para reclamar tus derechos y beneficios sociales ante despido intempestivo.',
    'Trámite administrativo conciliatorio y conminatorio ante el Ministerio de Trabajo en Cochabamba para empleados desvinculados.',
    'Laboral',
    'Jefatura Departamental de Trabajo de Cochabamba',
    'Calle Antezana N° 548 entre Colombia y Ecuador',
    '5 a 15 días hábiles',
    0.00,
    'Baja',
    false,
    true,
    '[
        "Carta de despido o memorándum (si existe)",
        "Últimas 3 papeletas de pago o extracto bancario de salarios",
        "Contrato de trabajo (escrito o verbal demostrable con testigos/marcado)",
        "Cédula de identidad original"
    ]'::jsonb,
    '[
        {"orden": 1, "titulo": "Apelación inicial", "detalle": "Acudir a plataforma de la Jefatura de Trabajo antes de los 30 días del despido."},
        {"orden": 2, "titulo": "Emisión de citación", "detalle": "El inspector cita al empleador a una audiencia de conciliación."},
        {"orden": 3, "titulo": "Audiencia conciliatoria", "detalle": "Revisión del cálculo de finiquito o conminatoria de reincorporación."}
    ]'::jsonb,
    '{"nodes": [{"id": "1", "label": "Reclamo"}, {"id": "2", "label": "Citación Empleador"}, {"id": "3", "label": "Conciliación / Finiquito"}], "edges": [{"from": "1", "to": "2"}, {"from": "2", "to": "3"}]}'::jsonb,
    '[
        {"pregunta": "¿El trámite en el Ministerio de Trabajo tiene costo?", "respuesta": "No, es 100% gratuito y de carácter protector al trabajador."}
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
