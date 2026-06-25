// pacientes.js - Lógica del Módulo 1 vinculada a Supabase
document.addEventListener('DOMContentLoaded', () => {
    const formPaciente = document.getElementById('form-paciente');
    const txtBuscar = document.getElementById('txt-buscar-paciente');

    if (formPaciente) {
        formPaciente.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dniVal = document.getElementById('dni').value.trim();

            if (dniVal.length !== 8) {
                alert("El DNI debe contener exactamente 8 dígitos.");
                return;
            }

            const nuevoPaciente = {
                codigo_paciente: `PAC${Date.now().toString().slice(-4)}`,
                nombres: document.getElementById('nombre').value.trim(),
                apellidos: "Registrado",
                tipo_documento: "DNI",
                documento_identidad: dniVal,
                fecha_nacimiento: document.getElementById('fechaNac').value,
                genero: document.getElementById('genero').value,
                telefono_contacto: document.getElementById('telefono').value.trim(),
                correo_electronico: document.getElementById('correo').value.trim(),
                contacto_emergencia_nombre: "Contacto Base",
                contacto_emergencia_parentesco: "Familiar",
                contacto_emergencia_telefono: "999999999"
            };

            try {
                await window.insertRecord('pacientes', nuevoPaciente);
                alert("Paciente guardado con éxito.");
                formPaciente.reset();
                document.getElementById('modal-paciente').style.display = 'none';
                renderizarPacientes();
            } catch (err) {
                alert("Error: El documento ya existe en Supabase.");
                console.error(err);
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
    if (!cuerpo) return;

    try {
        const pacientes = await window.getAllRecords('pacientes');
        
        // 1. Procesar y actualizar contadores (Métricas)
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

        document.getElementById('lbl-total-pacientes').innerText = total;
        document.getElementById('lbl-adultos').innerText = adults;
        document.getElementById('lbl-menores').innerText = menores;

        // 2. Filtrar si el usuario escribe en el buscador
        const filtrados = pacientesProcesados.filter(p => 
            p.nombres.toLowerCase().includes(busqueda) || 
            p.documento_identidad.includes(busqueda)
        );

        if (filtrados.length === 0) {
            cuerpo.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:15px;">No se encontraron registros.</td></tr>';
            return;
        }

        // 3. Pintar Tabla Principal
        cuerpo.innerHTML = filtrados.map(p => `
            <tr>
                <td><strong>${p.codigo_paciente}</strong></td>
                <td>${p.nombres}</td>
                <td>${p.documento_identidad}</td>
                <td>${p.edad} años</td>
                <td>${p.telefono_contacto}</td>
                <td>
                    <button onclick="eliminarPaciente('${p.documento_identidad}')" style="color:#ef4444; border:none; background:none; cursor:pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // 4. Pintar Barra Lateral de Recientes (Últimos 3 creados)
        if (listaRecientes) {
            const recientes = [...pacientesProcesados].reverse().slice(0, 3);
            listaRecientes.innerHTML = recientes.map(r => `
                <div class="recent-item" style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                    <p style="margin:0; font-weight:600; color:#003366;">${r.nombres}</p>
                    <small style="color:#64748b;">Código: ${r.codigo_paciente}</small>
                </div>
            `).join('');
        }

    } catch (err) {
        console.error("Error al renderizar:", err);
    }
}

window.eliminarPaciente = async (dni) => {
    if (!confirm("¿Desea eliminar permanentemente a este paciente?")) return;
    try {
        const { error } = await window.supabaseClient.from('pacientes').delete().eq('documento_identidad', dni);
        if (error) throw error;
        renderizarPacientes();
    } catch (err) {
        alert("Error al eliminar.");
    }
};
