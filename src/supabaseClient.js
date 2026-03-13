import { createClient } from '@supabase/supabase-js';
console.log("🔥 URL QUE VITE ESTÁ LEYENDO: ", import.meta.env.VITE_SUPABASE_URL);
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// EL ESCUDO: Si no detecta las variables en Vercel, avisa al programador sin romper la UI
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("🔴 ALERTA DE DESARROLLADOR: Faltan las variables de entorno de Supabase (VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY). Asegúrate de agregarlas en la configuración de Vercel.");
}

// Inyectamos valores de respaldo para evitar un error fatal (Crash) en el renderizado inicial de React
export const supabase = createClient(
    supabaseUrl || 'https://falta-configurar-url.supabase.co',
    supabaseAnonKey || 'falta-configurar-key-secreta'
);