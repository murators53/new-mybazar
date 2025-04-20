// src/app/api/order/admin/route.ts
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { verifyJWT } from "@/lib/jwt";
import Order from "@/models/Order";

export async function GET(req: Request) {
  await connectDb();

  const auth = req.headers.get("authorization")?.split(" ")[1];
  if (!auth) {
    return NextResponse.json({ message: "Yetkilendirme yok" }, { status: 401 });
  }
  const decoded = await verifyJWT(auth);
  if (!decoded?.isAdmin) {
    return NextResponse.json({ message: "Admin yetkisi yok" }, { status: 403 });
  }

  const orders = await Order.find().sort({ createdAt: -1 });
  // each Order already has an `email` field
  const payload = orders.map((o) => ({
    _id: o._id,
    email: o.email,
    total: o.total,
    createdAt: o.createdAt,
  }));
  return NextResponse.json(payload);
}
