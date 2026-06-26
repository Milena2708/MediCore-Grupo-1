// =============================================
// MÓDULO DE CITAS
// =============================================

async function crearCita(datos) {
    const { data: confMedico } = await supabase
        .from('citas')
        .select('id')
        .eq('medico', datos.medico)
        .eq('fecha', datos.fecha)
        .eq('hora', datos.hora)
        .neq('estado', 'cancelada')
        .maybeSingle();

    if (confMedico) throw new Error('El médico ya tiene una cita agendada en ese horario.');

    const { data, error } = await supabase
        .from('citas')
        .insert([{
            codigo: datos.codigo,
            paciente_id: datos.paciente_id,
            especialidad: datos.especialidad,
            medico: datos.medico,
            fecha: datos.fecha,
            hora: datos.hora,
            motivo: datos.motivo,
            prioridad: datos.prioridad,
            justificacion_prioridad: datos.justificacion_prioridad || null,
            estado: 'programada',
            creado_por: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

async function enviarASalaDeEspera(citaId) {
    await supabase.from('citas').update({ estado: 'en_espera' }).eq('id', citaId);
    const { data, error } = await supabase
        .from('sala_espera')
        .insert([{ cita_id: citaId, hora_llegada: new Date().toISOString(), estado: 'en_espera' }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

async function cargarSelectPacientes() {
    const select = document.getElementById('selectPaciente');
    if (!select) return;
    const { data: pacientes } = await supabase.from('pacientes').select('id, codigo, nombres, apellidos').order('apellidos');
    select.innerHTML = '<option value="">— Selecciona un paciente —</option>';
    pacientes?.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.apellidos}, ${p.nombres} (${p.codigo})</option>`;
    });
}