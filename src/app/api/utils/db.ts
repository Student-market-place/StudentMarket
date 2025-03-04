import { createClient } from '@supabase/supabase-js';
import { env } from 'process';


// Récupère les variables d'environnement
const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.CLIENT_API_KEY;

// Validation des variables d'environnement
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY ne sont pas définies dans votre fichier .env.local'
  );
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
