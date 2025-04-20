import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { verifyJWT } from "@/lib/jwt";
import Product from "@/models/Product";
import Order from "@/models/Order";
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

    // 🎯 Burada MongoDB'den sayıları çekiyoruz
    const [productsCount, ordersCount, usersCount] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
    ]);

    return NextResponse.json({
      productsCount,
      ordersCount,
      usersCount,
    });
  } catch (error) {
    console.error("🔥 Admin dashboard verisi alınamadı:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
