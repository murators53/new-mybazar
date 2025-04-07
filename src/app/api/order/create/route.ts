// Bu sadece "sipariş kaydı" için kullanılır.

import clientPromise from "@/lib/mongo";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export  async function POST(req: NextRequest) {
    // 1️⃣ Authorization header'ını al (Bearer token içeriyor)
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(' ')[1];

    // 2️⃣ Token yoksa → giriş yapılmamıştır
    if (!token) return NextResponse.json({ message: 'Token yok' }, { status: 401 })

    try {
        // 3️⃣ JWT token'ı doğrula (kimlik kontrolü)
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
        
        // 4️⃣ İstek body’sinden cartItems dizisini al
        const { cartItems } = await req.json();

        // 5️⃣ Geçersiz sepet kontrolü (boş ya da dizi değilse)
        if (!cartItems || !Array.isArray(cartItems)) {
            return NextResponse.json({ message: 'Geçersiz seper' }, { status: 400 });
        }

        // 6️⃣ Toplam tutarı hesapla (fiyat x adet)
        const total = cartItems.reduce((sum: number, item: any) => {
            return sum + item.price * item.quantity;
        }, 0);

        // 7️⃣ MongoDB bağlantısını kur
        const client = await clientPromise;
        const db = client.db('myshop');

        // 8️⃣ Siparişi veritabanına ekle
        await db.collection('orders').insertOne({
            userId: decoded.id,
            email: decoded.email,
            cartItems,
            total,
            status: 'hazırlanıyor',
            createdAt: new Date(),
        });

        // 9️⃣ Başarılı yanıt dön
        return NextResponse.json({ message: 'Sipariş başarıyla oluşturuldu ✅' });
    } catch (err) {
        // 🔴 Token geçersizse (sahte / süresi dolmuş) → 403 dön
        return NextResponse.json({ message: 'Token geçersiz ' }, { status: 403 });
    }
}/*{
  "userId": "abc123",
  "email": "kullanici@mail.com",
  "cartItems": [...],
  "total": 1000,
  "status": "hazırlanıyor",
  "createdAt": "2025-04-06T13:15:00.000Z"
}
  🧠 Teknik ve Kavramsal Özet – API Route
Aşama	Ne Yapıyor?	Açıklama
1️⃣	Token alımı	Kullanıcının kim olduğunu anlamak için gerekli
3️⃣	JWT verify	id, email gibi bilgiler token'dan çıkarılır
4️⃣	İstek verisi alınır	Sepetteki ürünler JSON body’den alınır
6️⃣	Toplam tutar hesaplanır	Sipariş özeti için kullanılır
8️⃣	MongoDB’ye yazılır	Sipariş kaydı yapılır
9️⃣	Yanıt dönülür	Frontend'e bilgi verilir
*/