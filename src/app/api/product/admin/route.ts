import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { connectDb } from "@/lib/connectDb";
import Product from "@/models/Product";

export async function DELETE(req: NextRequest) {
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")[1];
    if (!accessToken) {
      return NextResponse.json({ message: "Yetkilendirme yok" }, { status: 401 });
    }

    const decoded = await verifyJWT(accessToken);
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ message: "Admin yetkisi yok" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ message: "Ürün ID'si eksik" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ürün silindi" }, { status: 200 });
  } catch (error) {
    console.error("DELETE API Hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDb(); // ✅ İlk başta DB'ye bağlanıyoruz.

    const id = req.nextUrl.searchParams.get("id");

    if (id) {
      const product = await Product.findById(id);

      if (!product) {
        return NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
      }
      return NextResponse.json(product);
    } else {
      const products = await Product.find();
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error("🔥 GET ürün hatası:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
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


// PUT: Ürün Güncelleme
export async function PUT(req: NextRequest) {
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")[1];
    if (!accessToken) {
      return NextResponse.json({ message: "Yetkilendirme yok" }, { status: 401 });
    }

    const decoded = await verifyJWT(accessToken);
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ message: "Admin yetkisi yok" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ message: "Ürün ID'si eksik" }, { status: 400 });
    }

    const { title, price, stock, image } = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        price,
        stock,
        image,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("🔥 PUT ürün hatası:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
