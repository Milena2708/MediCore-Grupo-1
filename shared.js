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
  startClock();
  setActiveNav();
});

// ── Supabase pacientes cache (compartido por citas, historial, sala) ──
const SUPABASE_URL_SH  = 'https://bhawfcvnthzdwmkgwgxj.supabase.co';
const SUPABASE_ANON_SH = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoYXdmY3ZudGh6ZHdta2d3Z3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MzY4MjUsImV4cCI6MjA5NjAxMjgyNX0.gpaCKHr2HqAg7k0Zb4VolKWNEZvBrgE7Y2bJuL27PYc';

let _pacientesCache = null;

async function fetchPacientesSupabase() {
  const res = await fetch(`${SUPABASE_URL_SH}/rest/v1/pacientes?select=*`, {
    headers: {
      'apikey':        SUPABASE_ANON_SH,
      'Authorization': `Bearer ${SUPABASE_ANON_SH}`,
      'Content-Type':  'application/json',
    },
  });
  if (!res.ok) throw new Error(`Supabase error ${res.status}`);
  const rows = await res.json();
  return rows.map(p => ({
    id:        p.id,
    codigo:    String(p.id),
    nombres:   p['Nombres']   ?? p['nombres']   ?? '',
    apellidos: p['Apellidos'] ?? p['apellidos'] ?? '',
    documento: String(p['N° documento'] ?? p['documento'] ?? ''),
    telefono:  String(p['Teléfono']     ?? p['telefono']  ?? '—'),
    edad:      calcAge(p['Fecha de nacimiento'] ?? p['fecha_nacimiento'] ?? null),
    tipoDoc:   'DNI',
    alergias:  [],
  }));
}

async function getPacientesCache() {
  if (_pacientesCache !== null) return _pacientesCache;
  try {
    _pacientesCache = await fetchPacientesSupabase();
  } catch (e) {
    console.error('Error al cargar pacientes:', e);
    _pacientesCache = [];
  }
  return _pacientesCache;
}

function getPacienteLocal(codigo) {
  if (!_pacientesCache) return null;
  return _pacientesCache.find(
    p => String(p.codigo ?? p.id) === String(codigo)
  ) || null;
}