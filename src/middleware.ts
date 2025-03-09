import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware qui s'exécute sur chaque requête
export async function middleware(request: NextRequest) {
  // Vérifier si c'est une redirection après authentification
  if (request.nextUrl.pathname === '/auth/create-account') {
    // Vérifier si un paramètre d'email existe déjà
    const hasEmail = request.nextUrl.searchParams.has('email');
    const email = request.nextUrl.searchParams.get('email');
    
    // Si le paramètre email est absent ou vide, nous pouvons essayer de le récupérer des cookies
    if (!hasEmail || (email && email.trim() === '')) {
      
      // Récupérer le cookie d'email personnalisé
      const userEmailCookie = request.cookies.get('user-email')?.value;
      
      if (userEmailCookie) {
        
        // Construire une nouvelle URL avec l'email
        const url = new URL(request.url);
        url.searchParams.set('email', userEmailCookie);
        
        // Rediriger vers la nouvelle URL avec l'email
        return NextResponse.redirect(url);
      } else {
        
        // Si nous n'avons pas l'email dans les cookies, essayons de faire une requête à notre API
        try {
          // Dans un environnement de production, il faudrait utiliser l'URL complète
          const apiUrl = new URL('/api/auth/session/email', request.url);
          const response = await fetch(apiUrl.toString(), {
            headers: {
              'Cookie': request.headers.get('cookie') || ''
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.email) {
              
              // Construire une nouvelle URL avec l'email
              const url = new URL(request.url);
              url.searchParams.set('email', data.email);
              
              // Rediriger vers la nouvelle URL avec l'email
              return NextResponse.redirect(url);
            }
          }
        } catch (error) {
          console.error("❌ Erreur lors de la récupération de l'email via l'API:", error);
        }
      }
    }
  }
  
  return NextResponse.next();
}

// Configurer sur quels chemins le middleware sera exécuté
export const config = {
  matcher: [
    // Appliquer ce middleware uniquement à certains chemins
    '/auth/create-account'
  ],
} 