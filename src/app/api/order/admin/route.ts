// app/api/order/admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { connectDb } from "@/lib/connectDb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.headers.get("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return NextResponse.json({ message: "Yetkilendirme yok" }, { status: 401 });
    }

    const decoded = await verifyJWT(accessToken);

    if (!decoded?.isAdmin) {
      return NextResponse.json({ message: "Admin yetkisi yok" }, { status: 403 });
    }

    await connectDb();

    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Sipariş çekme hatası:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}
