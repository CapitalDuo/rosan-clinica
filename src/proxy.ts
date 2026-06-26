import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  try {
    return await updateSession(request)
  } catch {
    // Falha transitória ao validar a sessão (ex.: Supabase Auth indisponível por
    // um instante) não pode derrubar a navegação com um 500. Deixa a requisição
    // seguir — o layout revalida a sessão e os error boundaries cobrem o resto.
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - image extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)',
  ],
}
