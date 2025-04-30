import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE 

  // maintenance 페이지 접근 시
  if (request.nextUrl.pathname.startsWith('/maintenance')) {
    // 유지보수 모드가 아닐 때는 홈으로 리다이렉션
    if (!maintenanceMode) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // API 요청은 그대로 처리
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // 유지보수 모드일 때 모든 일반 페이지는 maintenance로 리다이렉션
  if (maintenanceMode) {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  return NextResponse.next()
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 