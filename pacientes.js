// =============================================
// MÓDULO DE PACIENTES — CRUD
// =============================================

async function crearPaciente(datos) {
    const { data, error } = await supabase
        .from('pacientes')
        .insert([{
            codigo: datos.codigo,
            nombres: datos.nombres,
            apellidos: datos.apellidos,
            tipo_documento: datos.tipo_documento,
            documento: datos.documento,
            fecha_nacimiento: datos.fecha_nacimiento,
            telefono: datos.telefono,
            correo: datos.correo || null,
            direccion: datos.direccion || null,
            alergias: datos.alergias,
            alergia_detalle: datos.alergia_detalle || null,
            contacto_emergencia_nombre: datos.contacto_nombre,
            contacto_emergencia_parentesco: datos.contacto_parentesco,
            contacto_emergencia_telefono: datos.contacto_telefono,
            creado_por: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

    if (error) {
        if (error.code === '23505') throw new Error('El código o documento ya existe.');
        throw new Error(error.message);
    }
    return data;
}

async function obtenerPacientes(busqueda = '') {
    let query = supabase.from('pacientes').select('*').order('fecha_creacion', { ascending: false });
    if (busqueda) {
        query = query.or(`nombres.ilike.%${busqueda}%,apellidos.ilike.%${busqueda}%,documento.ilike.%${busqueda}%`);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
}

async function actualizarPaciente(id, datos) {
    const { data, error } = await supabase
        .from('pacientes')
        .update({
            nombres: datos.nombres,
            apellidos: datos.apellidos,
            telefono: datos.telefono,
            correo: datos.correo || null,
            direccion: datos.direccion || null,
            alergias: datos.alergias,
            alergia_detalle: datos.alergia_detalle || null,
            contacto_emergencia_nombre: datos.contacto_nombre,
            contacto_emergencia_parentesco: datos.contacto_parentesco,
            contacto_emergencia_telefono: datos.contacto_telefono
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

async function generarCodigoPaciente() {
    const { count } = await supabase.from('pacientes').select('*', { count: 'exact', head: true });
    return `PAC${String((count || 0) + 1).padStart(3, '0')}`;
}

async function cargarTablaPacientes(busqueda = '') {
    const tbody = document.getElementById('tablaPacientes');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';
    try {
        const pacientes = await obtenerPacientes(busqueda);
        if (pacientes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No se encontraron pacientes</td></tr>';
            return;
        }
        tbody.innerHTML = pacientes.map(p => `
            <tr>
                <td>${p.codigo}</td>
                <td>${p.nombres} ${p.apellidos}</td>
                <td>${p.tipo_documento}: ${p.documento}</td>
                <td>${p.telefono}</td>
                <td>${p.alergias?.length ? `<span class="badge">${p.alergias.join(', ')}</span>` : 'Ninguna'}</td>
                <td>
                    <button onclick="editarPaciente('${p.id}')">Editar</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="6" style="color:red">${e.message}</td></tr>`;
    }
}
