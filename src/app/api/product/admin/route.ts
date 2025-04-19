import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import clientPromise from "@/lib/mongo";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const products = await db.collection("products").find().toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error("🔥 GET /api/product/admin error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyJWT(token);

    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { title, price, stock, image } = await req.json();

    if (
      typeof title !== "string" ||
      typeof price !== "number" ||
      typeof stock !== "number" ||
      typeof image !== "string" ||
      !title.trim() ||
      !image.trim()
    ) {
      return NextResponse.json(
        { message: "Geçersiz veya eksik ürün verisi" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const newProduct = {
      title: title.trim(),
      price,
      stock,
      image: image.trim(),
      createdAt: new Date(),
    };

    const result = await db.collection("products").insertOne(newProduct);

    return NextResponse.json(
      { message: "Ürün başarıyla oluşturuldu", productId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 POST /api/product/admin error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
