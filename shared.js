// shared.js - Configuración Única y Centralizada para el Examen Final
const SUPABASE_URL = "https://bhawfcvnthzdwmkgwgxj.supabase.co";
const SUPABASE_KEY = "sb_publishable_Tv-xN-BHuTf06AcjEkfwpA_dq4hbJ83";

// Inicializar el cliente global en el objeto window
if (window.supabase) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Conexión centralizada con Supabase establecida.");
} else {
    console.error("Error crítico: No se encontró el CDN de Supabase en el HTML.");
}

// Lógica para todas las páginas internas de la clínica
document.addEventListener('DOMContentLoaded', () => {
    // 1. Reloj activo de la barra de navegación (Formato 00:00:00)
    const clockElement = document.getElementById('nav-clock');
    if (clockElement) {
        setInterval(() => {
            const ahora = new Date();
            const hrs = String(ahora.getHours()).padStart(2, '0');
            const mins = String(ahora.getMinutes()).padStart(2, '0');
            const secs = String(ahora.getSeconds()).padStart(2, '0');
            clockElement.innerText = `${hrs}:${mins}:${secs}`;
        }, 1000);
    }

    // 2. Control obligatorio de accesos por Roles y Sesión
    const rutaActual = window.location.pathname;
    if (!rutaActual.includes('login.html')) {
        const sesionRol = sessionStorage.getItem('user_rol');
        // Si no hay sesión iniciada, rebota automáticamente al login
        if (!sesionRol) {
            alert("Acceso denegado. Debe iniciar sesión en el sistema.");
            window.location.href = "login.html";
        }
    }
});

// --- FUNCIÓN GLOBAL DE CIERRE DE SESIÓN ---
window.cerrarSesion = async () => {
    try {
        const { error } = await window.supabaseClient.auth.signOut();
        if (error) throw error;
        sessionStorage.clear();
        window.location.href = "login.html";
    } catch (err) {
        alert(`Error al cerrar sesión: ${err.message}`);
    }
};