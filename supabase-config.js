// js/supabase-config.js
// =============================================
// CONFIGURACIÓN CENTRAL DE SUPABASE
// Reemplaza los valores con los tuyos de Supabase → Settings → API
// =============================================

const SUPABASE_URL = 'https://tadvsjmhcftzjdlitdbs.supabase.co';  // ← Cambia esto
const SUPABASE_ANON_KEY = 'sb_publishable_MubKYHbKGsGNDRreaNNi9g_-Ym-obH3';               // ← Cambia esto

// Importar la librería de Supabase (via CDN)
// Este import se pone en cada HTML antes de los scripts
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// Crear el cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exportar para usar en otros scripts
// (como los archivos son HTML plano, simplemente se carga antes que los demás)
