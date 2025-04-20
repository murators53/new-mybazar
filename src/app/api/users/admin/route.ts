// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { verifyJWT } from "@/lib/jwt";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const accessToken = req.headers.get("authorization")?.split(" ")[1];
    if (!accessToken) {
      return NextResponse.json({ message: "Yetkilendirme yok" }, { status: 401 });
    }

    const decoded = await verifyJWT(accessToken);
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ message: "Admin yetkisi yok" }, { status: 403 });
    }

    const users = await User.find().sort({ createdAt: -1 }).select("_id email isAdmin createdAt");
    
    return NextResponse.json(users);
  } catch (error) {
    console.error("🔥 Kullanıcıları çekme hatası:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
