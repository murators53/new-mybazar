import jwt from "jsonwebtoken";

export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { id: string; email: string; isAdmin: boolean };
  } catch (error) {
    console.error("JWT doğrulama hatası:", error);
    return null;
  }
}
