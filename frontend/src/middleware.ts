import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(request: NextRequest) {
  // 현재 접속 경로
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token");
  // 인증이 필요없는 페이지 목록
  const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    // "/api/auth", // 인증 관련 API 경로
  ];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  // 인증이 필요한 페이지인데 토큰이 없는 경우
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // 이미 로그인된 사용자가 로그인/회원가입 페이지 접근 시도
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/myproject", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
