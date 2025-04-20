import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { verifyJWT } from "@/lib/jwt";
import User from "@/models/User";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    const userId = params.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    if (user.isAdmin) {
      return NextResponse.json({ message: "Admin kullanıcı silinemez" }, { status: 403 });
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    console.error("🔥 Kullanıcı silme hatası:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
