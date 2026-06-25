// pacientes.js - Módulo de Pacientes consumiendo shared.js
document.addEventListener('DOMContentLoaded', () => {
    const formPaciente = document.getElementById('form-paciente');
    const txtBuscar = document.getElementById('txt-buscar-paciente');
    const supabase = window.supabaseClient;

    if (formPaciente) {
        formPaciente.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dniVal = document.getElementById('dni').value.trim();

            if (dniVal.length !== 8) {
                alert("El DNI debe contener exactamente 8 dígitos numéricos.");
                return;
            }

            const nuevoPaciente = {
                codigo: `PAC-${Date.now().toString().slice(-4)}`,
                nombres: document.getElementById('nombre').value.trim(),
                apellidos: "Registrado",
                tipo_documento: "DNI",
                documento: dniVal,
                fecha_nacimiento: document.getElementById('fechaNac').value,
                telefono: document.getElementById('telefono').value.trim(),
                correo: document.getElementById('correo').value.trim(),
                direccion: "Dirección Central",
                alergias: "Ninguna",
                contacto_emergencia_nombre: "Contacto Familiar",
                contacto_emergencia_parentesco: "Pariente",
                contacto_emergencia_telefono: "999999999"
            };

            try {
                const { error } = await supabase.from('pacientes').insert([nuevoPaciente]);
                if (error) throw error;

                alert("Paciente guardado con éxito en Supabase.");
                formPaciente.reset();
                document.getElementById('modal-paciente').style.display = 'none';
                renderizarPacientes();
            } catch (err) {
                alert(`Error al guardar: ${err.message || "El DNI ya se encuentra registrado."}`);
            }
        });
    }

    if (txtBuscar) {
        txtBuscar.addEventListener('input', () => {
            renderizarPacientes(txtBuscar.value.trim().toLowerCase());
        });
    }

    renderizarPacientes();
});

async function renderizarPacientes(busqueda = "") {
    const cuerpo = document.querySelector('#tabla-pacientes tbody');
    const listaRecientes = document.getElementById('lista-recientes');
    const supabase = window.supabaseClient;
    if (!cuerpo) return;

    try {
        const { data: pacientes, error } = await supabase.from('pacientes').select('*');
        if (error) throw error;

        let total = pacientes.length;
        let adultos = 0;
        let menores = 0;

        const pacientesProcesados = pacientes.map(p => {
            const hoy = new Date();
            const cumple = new Date(p.fecha_nacimiento);
            let edad = hoy.getFullYear() - cumple.getFullYear();
            if (hoy.getMonth() < cumple.getMonth() || (hoy.getMonth() === cumple.getMonth() && hoy.getDate() < cumple.getDate())) {
                edad--;
            }
            if (edad >= 18) adultos++; else menores++;
            return { ...p, edad };
        });

        // Cargar las métricas de las tarjetas dinámicas
        if (document.getElementById('lbl-total-pacientes')) document.getElementById('lbl-total-pacientes').innerText = total;
        if (document.getElementById('lbl-adultos')) document.getElementById('lbl-adultos').innerText = adultos;
        if (document.getElementById('lbl-menores')) document.getElementById('lbl-menores').innerText = menores;

        const filtrados = pacientesProcesados.filter(p =>
            p.nombres.toLowerCase().includes(busqueda) || p.documento.includes(busqueda)
        );

        if (filtrados.length === 0) {
            cuerpo.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:15px;">No se encontraron registros en el sistema.</td></tr>';
            return;
        }

        cuerpo.innerHTML = filtrados.map(p => `
            <tr>
                <td><strong>${p.codigo}</strong></td>
                <td>${p.nombres} ${p.apellidos}</td>
                <td>${p.documento}</td>
                <td>${p.edad} años</td>
                <td>${p.telefono}</td>
                <td>
                    <button onclick="eliminarPaciente('${p.id}')" style="color:#ef4444; border:none; background:none; cursor:pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        if (listaRecientes) {
            const recientes = [...pacientesProcesados].reverse().slice(0, 3);
            listaRecientes.innerHTML = recientes.map(r => `
                <div class="recent-item" style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                    <p style="margin:0; font-weight:600; color:#0f4c81;">${r.nombres}</p>
                    <small style="color:#64748b;">DNI: ${r.documento}</small>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error(err);
    }
}

window.eliminarPaciente = async (id) => {
    if (!confirm("¿Desea eliminar permanentemente a este paciente?")) return;
    try {
        const { error } = await window.supabaseClient.from('pacientes').delete().eq('id', id);
        if (error) throw error;
        renderizarPacientes();
    } catch (err) {
        alert("Error al eliminar.");
    }
};