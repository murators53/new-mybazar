import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // Gelen jwt for token verify 
import clientPromise from '@/lib/mongo';

//gelen GET isteklerini yakalayan handler.
export async function GET(req: NextRequest) {
    // 🛡️ 1. Authorization Header'dan Bearer token'ı al
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    // ❌ 2. Token yoksa → 401 Unauthorized dön
    if (!token) {
        return NextResponse.json({ message: 'Token yok' }, { status: 401 });
    }

    try {
        // 🔐 3. Token'ı çözümle (decode et) ve doğrula
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
        //{ id: 'kullanici-id', email: 'example@mail.com', ... }

        // 🔌 4. MongoDB bağlantısını kur
        const client = await clientPromise;
        const db = client.db('myshop');// myshop adlı veritabanına bağlanılı

        // 📦 5. Veritabanından bu kullanıcıya ait sepet kayıtlarını al
        const carts = await db
            .collection('carts')              // "carts" koleksiyonu
            .find({ userId: decoded.id })    // sadece ilgili kullanıcıya ait veriler
            .sort({ createdAt: -1 })         // son eklenen en üstte
            .toArray();                      // sonucu diziye dönüştür

        // ✅ 6. Sepet geçmişi başarılı şekilde geri döndürülür
        return NextResponse.json(carts);
    } catch (error) {
        // 🔒 7. Token geçersiz ya da verify başarısızsa → 403 Forbidden
        return NextResponse.json({ message: "Token geçersiz" }, { status: 403 });
    }
}
/* 🧠 Kavramsal Özet
Aşama	Açıklama
1️⃣	İstekten Authorization: Bearer <token> alınır
2️⃣	Token yoksa hata verilir
3️⃣	JWT çözülür → kullanıcı bilgileri (id, email, isAdmin) alınır
4️⃣	MongoDB bağlantısı yapılır
5️⃣	carts koleksiyonundan kullanıcıya ait kayıtlar çekilir
6️⃣	Sonuç, frontend'e JSON olarak gönderilir
❌	Token hatalıysa, "geçersiz" mesajı döner

[✅ Cevap Yapısı (Frontend'e Dönecek Şey)
  {
    "_id": "...",
    "userId": "123",
    "email": "example@gmail.com",
    "cartItems": [...],
    "createdAt": "2025-04-06T..."
  },
  ...
]
*/


