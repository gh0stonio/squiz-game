import jwt_decode from 'jwt-decode';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const idTokenCookie = request.cookies.get('id_token');

    if (!idTokenCookie) {
      return NextResponse.redirect(
        new URL(`/login?referer=${request.nextUrl.pathname}`, request.url),
      );
    }

    const admins = process.env.NEXT_PUBLIC_ROOT_ADMINS?.split(';');
    const decodedToken = jwt_decode(idTokenCookie.value) as { email: string };

    if (!admins?.includes(decodedToken['email'])) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|api|_next|static|favicon.ico).*)'],
};
