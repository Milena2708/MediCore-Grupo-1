// shared.js - Conexión oficial y funciones globales de Supabase
const SUPABASE_URL = "https://bhawfcvnthzdwmkgwgxj.supabase.co";
const SUPABASE_KEY = "sb_publishable_Tv-xN-BHuTf06AcjEkfwpA_dq4hbJ83";

// Inicializar el cliente de Supabase adjuntándolo a window
if (window.supabase) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Conectado exitosamente a Supabase.");
} else {
    console.error("Error: No se cargó la librería CDN de Supabase en el HTML.");
}

// Configurar botón global de la Navbar "Agendar cita"
document.addEventListener('DOMContentLoaded', () => {
    const btnNavAgendar = document.getElementById('btn-nav-agendar') || document.querySelector('.btn-agendar');
    if (btnNavAgendar) {
        btnNavAgendar.addEventListener('click', () => {
            window.location.href = 'citas.html';
        });
    }
});

// --- FUNCIONES CRUD REUTILIZABLES ---
window.insertRecord = async (tableName, recordObject) => {
    const { data, error } = await window.supabaseClient
        .from(tableName)
        .insert([recordObject])
        .select();
    if (error) throw error;
    return data;
};

window.getAllRecords = async (tableName) => {
    const { data, error } = await window.supabaseClient
        .from(tableName)
        .select('*');
    if (error) throw error;
    return data;
};