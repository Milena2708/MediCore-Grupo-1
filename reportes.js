// =============================================
// MÓDULO DE REPORTES MÉDICOS
// =============================================

async function obtenerMetricasGlobales() {
    const { count: pacientes } = await supabase.from('pacientes').select('*', { count: 'exact', head: true });
    const { count: citas } = await supabase.from('citas').select('*', { count: 'exact', head: true });
    const { data: atendidas } = await supabase.from('citas').select('id').eq('estado', 'atendida');

    return {
        totalPacientes: pacientes || 0,
        totalCitas: citas || 0,
        totalAtendidos: atendidas?.length || 0
    };
}
