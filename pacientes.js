// pacientes.js - Módulo 1: Registro de Pacientes con Supabase
document.addEventListener('DOMContentLoaded', () => {
    const formPaciente = document.getElementById('form-paciente');
    const inputFechaNac = document.getElementById('fechaNac');
    const inputDni = document.getElementById('dni');

    // 1. Escuchar el cambio de fecha para validar y calcular la edad automáticamente
    if (inputFechaNac) {
        inputFechaNac.addEventListener('change', () => {
            const fechaVal = inputFechaNac.value;
            if (!fechaVal) return;

            const hoy = new Date();
            const cumple = new Date(fechaVal);
            
            if (cumple > hoy) {
                alert("La fecha de nacimiento no puede ser futura.");
                inputFechaNac.value = "";
                return;
            }

            let edad = hoy.getFullYear() - cumple.getFullYear();
            const m = hoy.getMonth() - cumple.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
                edad--;
            }
            console.log(`Edad calculada automáticamente: ${edad} años.`);
        });
    }

    // 2. Controlar el envío del formulario hacia Supabase
    if (formPaciente) {
        formPaciente.addEventListener('submit', async (e) => {
            e.preventDefault();

            const dniVal = inputDni.value.trim();
            
            // Validación estricta de los 8 dígitos del DNI peruano
            if (dniVal.length !== 8) {
                alert("El DNI debe tener exactamente 8 dígitos.");
                return;
            }

            // Crear el objeto con la estructura exacta de la tabla de Supabase
            const nuevoPaciente = {
                codigo_paciente: `PAC${Date.now().toString().slice(-4)}`, // Código autogenerado único
                nombres: document.getElementById('nombre').value.trim(),
                apellidos: "Registrado", // Se mapea al campo requerido en la estructura base
                tipo_documento: "DNI",
                documento_identidad: dniVal,
                fecha_nacimiento: inputFechaNac.value,
                genero: document.getElementById('genero').value,
                telefono_contacto: document.getElementById('telefono').value.trim(),
                correo_electronico: document.getElementById('correo').value.trim(),
                contacto_emergencia_nombre: "Contacto Familiar",
                contacto_emergencia_parentesco: "Pariente",
                contacto_emergencia_telefono: "999999999"
            };

            try {
                // Usar la función global asíncrona definida en shared.js
                await window.insertRecord('pacientes', nuevoPaciente);
                alert("Paciente registrado con éxito en la nube de Supabase.");
                formPaciente.reset();
                renderizarPacientes();
            } catch (error) {
                alert(`Error al guardar: ${error.message || "El DNI ya se encuentra registrado."}`);
            }
        });
    }

    // Cargar la tabla al iniciar la página
    renderizarPacientes();
});

// 3. Renderizar la lista leyendo en tiempo real desde la nube
async function renderizarPacientes() {
    const cuerpoTabla = document.querySelector('#tabla-pacientes tbody');
    if (!cuerpoTabla) return;

    try {
        const pacientes = await window.getAllRecords('pacientes');
        
        if (pacientes.length === 0) {
            cuerpoTabla.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No hay pacientes registrados en la nube.</td></tr>';
            return;
        }

        cuerpoTabla.innerHTML = pacientes.map(p => {
            // Calcular edad al vuelo para mostrar en la interfaz
            const hoy = new Date();
            const cumple = new Date(p.fecha_nacimiento);
            let edad = hoy.getFullYear() - cumple.getFullYear();
            const m = hoy.getMonth() - cumple.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
                edad--;
            }
            
            return `
                <tr>
                    <td>${p.documento_identidad}</td>
                    <td>${p.nombres}</td>
                    <td>${edad} años</td>
                    <td>${p.genero}</td>
                    <td>
                        <button onclick="eliminarPaciente('${p.documento_identidad}')" style="color: #ef4444; border: none; background: none; cursor: pointer; font-size: 16px;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error("Error al cargar la tabla de pacientes:", err);
    }
}

// 4. Función global para eliminar registros directo en Supabase
window.eliminarPaciente = async (dni) => {
    if (!confirm("¿Está seguro de eliminar este paciente de la base de datos centralizada?")) return;
    
    try {
        const { error } = await window.supabaseClient
            .from('pacientes')
            .delete()
            .eq('documento_identidad', dni);
            
        if (error) throw error;
        
        alert("Paciente eliminado correctamente.");
        renderizarPacientes();
    } catch (err) {
        alert(`No se pudo eliminar el registro: ${err.message}`);
    }
};