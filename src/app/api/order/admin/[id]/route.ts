// src/app/api/order/admin/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { verifyJWT } from "@/lib/jwt";
import Order from "@/models/Order";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDb();

  const auth = req.headers.get("authorization")?.split(" ")[1];
  if (!auth) {
    return NextResponse.json({ message: "Yetkilendirme yok" }, { status: 401 });
  }
  const decoded = await verifyJWT(auth);
  if (!decoded?.isAdmin) {
    return NextResponse.json(
      { message: "Admin yetkisi yok" },
      { status: 403 }
    );
  }

  const { id } = params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Geçersiz sipariş ID" },
      { status: 400 }
    );
  }

  const order = await Order.findById(id);
  if (!order) {
    return NextResponse.json({ message: "Sipariş bulunamadı" }, { status: 404 });
  }

  // email is directly on the order doc
  return NextResponse.json({
    _id: order._id,
    userId: order.userId,
    email: order.email,
    cartItems: order.cartItems,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
  });
}
