// =============================================
// MÓDULO HISTORIAL CLÍNICO
// =============================================

async function crearHistorial(datos) {
    const { data, error } = await supabase
        .from('historial_consultas')
        .insert([{
            paciente_id: datos.paciente_id,
            cita_id: datos.cita_id,
            medico: datos.medico,
            especialidad: datos.especialidad,
            sintomas: datos.sintomas,
            diagnostico: datos.diagnostico,
            tratamiento: datos.tratamiento,
            medicamentos: datos.medicamentos || [],
            observaciones: datos.observaciones || null
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

async function buscarHistorialPaciente(termino) {
    const { data: pacientes } = await supabase
        .from('pacientes')
        .select('id')
        .or(`documento.eq.${termino},nombres.ilike.%${termino}%,apellidos.ilike.%${termino}%`);

    if (!pacientes?.length) return [];
    const ids = pacientes.map(p => p.id);

    const { data, error } = await supabase
        .from('historial_consultas')
        .select('*, pacientes(*), citas(*)')
        .in('paciente_id', ids);

    if (error) throw new Error(error.message);
    return data;
}
