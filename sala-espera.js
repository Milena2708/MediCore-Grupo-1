// =============================================
// MÓDULO SALA DE ESPERA (Tiempo Real)
// =============================================

async function obtenerSalaEspera() {
    const { data, error } = await supabase
        .from('sala_espera')
        .select(`*, citas (*, pacientes (*))`)
        .in('estado', ['en_espera', 'en_atencion']);

    if (error) throw new Error(error.message);

    const orden = { urgente: 0, preferencial: 1, normal: 2 };
    return data.sort((a, b) => {
        const pA = orden[a.citas?.prioridad] ?? 3;
        const pB = orden[b.citas?.prioridad] ?? 3;
        if (pA !== pB) return pA - pB;
        return new Date(a.hora_llegada) - new Date(b.hora_llegada);
    });
}

async function avanzarEstado(salaId, citaId, nuevoEstado) {
    const mapeoModulos = { 'en_atencion': 'en_atencion', 'atendido': 'atendida', 'no_asistio': 'no_asistio' };
    await supabase.from('sala_espera').update({ estado: salaId === 'atendido' || salaId === 'no_asistio' ? salaId : nuevoEstado }).eq('id', salaId);
    await supabase.from('citas').update({ estado: mapeoModulos[nuevoEstado] || nuevoEstado }).eq('id', citaId);
}

function suscribirSalaEspera(alCambiar) {
    return supabase
        .channel('cambios-sala')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sala_espera' }, alCambiar)
        .subscribe();
}