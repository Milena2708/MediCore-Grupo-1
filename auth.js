// =============================================
// PROTECCIÓN DE RUTAS Y CONTROL DE ROLES
// =============================================

let usuarioActual = null;

async function verificarAutenticacion() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    const { data: perfil, error } = await supabase
        .from('usuarios_perfil')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

    if (error || !perfil) {
        console.error('No se encontró el perfil del usuario');
        window.location.href = 'login.html';
        return;
    }

    usuarioActual = perfil;

    // Asignar datos al Navbar si los elementos existen
    const elNombre = document.getElementById('nombreUsuario');
    if (elNombre) elNombre.textContent = perfil.nombre;

    const elRol = document.getElementById('rolUsuario');
    if (elRol) elRol.textContent = perfil.rol.charAt(0).toUpperCase() + perfil.rol.slice(1);

    aplicarRestriccionesRol(perfil.rol);
}

const PERMISOS_ROL = {
    administrador: ['pacientes', 'citas', 'sala-espera', 'historial', 'reportes'],
    recepcion:     ['pacientes', 'citas', 'sala-espera'],
    medico:        ['sala-espera', 'historial'],
    enfermeria:    ['sala-espera']
};

function aplicarRestriccionesRol(rol) {
    const modulosPermitidos = PERMISOS_ROL[rol] || [];
    document.querySelectorAll('[data-modulo]').forEach(el => {
        const modulo = el.getAttribute('data-modulo');
        if (!modulosPermitidos.includes(modulo)) {
            el.style.display = 'none';
        }
    });
}

async function cerrarSesion() {
    await supabase.auth.signOut();
    usuarioActual = null;
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', verificarAutenticacion);