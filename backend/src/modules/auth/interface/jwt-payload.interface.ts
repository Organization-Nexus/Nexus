export interface JwtPayload {
  sub: string; // 사용자 ID
  email: string;
  role: string;
}
