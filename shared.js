// shared.js - Conexión oficial y funciones globales de Supabase
const SUPABASE_URL = "https://bhawfcvnthzdwmkgwgxj.supabase.co";
const SUPABASE_KEY = "sb_publishable_Tv-xN-BHuTf06AcjEkfwpA_dq4hbJ83";

// Inicializar el cliente de Supabase adjuntándolo a window de manera segura
if (window.supabase) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Conectado exitosamente a Supabase.");
} else {
    // Si falla el CDN por red, creamos un fallback temporal para evitar que la página muera por completo
    console.error("Error: No se cargó la librería CDN de Supabase en el HTML.");
    window.supabaseClient = null;
}

// Inicializar el reloj de la barra de navegación y la redirección
document.addEventListener('DOMContentLoaded', () => {
    // Función para el reloj activo en la esquina derecha de la navbar
    function startClock() {
        const clockElement = document.querySelector('.navbar .time') || document.getElementById('clock') || { innerText: "" };
        setInterval(() => {
            const ahora = new Date();
            const hrs = String(ahora.getHours()).padStart(2, '0');
            const mins = String(ahora.getMinutes()).padStart(2, '0');
            const secs = String(ahora.getSeconds()).padStart(2, '0');
            clockElement.innerText = `${hrs}:${mins}:${secs}`;
        }, 1000);
    }
    startClock();

    const btnNavAgendar = document.getElementById('btn-nav-agendar') || document.querySelector('.btn-agendar');
    if (btnNavAgendar) {
        btnNavAgendar.addEventListener('click', () => {
            window.location.href = 'citas.html';
        });
    }
});

// --- FUNCIONES CRUD REUTILIZABLES ASEGURADAS ---
window.insertRecord = async (tableName, recordObject) => {
    if (!window.supabaseClient) throw new Error("Supabase no está inicializado.");
    const { data, error } = await window.supabaseClient
        .from(tableName)
        .insert([recordObject])
        .select();
    if (error) throw error;
    return data;
};

window.getAllRecords = async (tableName) => {
    if (!window.supabaseClient) {
        console.error("Supabase no disponible.");
        return [];
    }
    const { data, error } = await window.supabaseClient
        .from(tableName)
        .select('*');
    if (error) throw error;
    return data;
};