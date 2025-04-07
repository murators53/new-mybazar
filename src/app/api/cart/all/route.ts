/*🔐 Sadece isAdmin: true olan kullanıcılar erişebilsin
📦 Tüm kullanıcıların sepet verileri listelensin */
import clientPromise from "@/lib/mongo";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    // 🛡️ 1. Authorization header'ından Bearer token'ı al
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1]; // "Bearer abc123" -> "abc123"

    // 🚫 2. Token yoksa yetkisiz erişim → 401 Unauthorized
    if (!token) {
        return NextResponse.json({ message: 'Token yok' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    
    try {
        // 🔐 3. JWT token'ı çözümle (verify et)
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
        // ❌ 4. Kullanıcının admin yetkisi yoksa → 403 Forbidden
        if (!decoded.isAdmin) {
            return NextResponse.json({ message: "Yetkiniz yok" }, { status: 403 });
        }

        // ✅ 5. MongoDB bağlantısını kur
        const client = await clientPromise;
        const db = client.db('myshop');

        // 📦 6. Veritabanından tüm sepet kayıtlarını çek (her kullanıcıya ait)
        const carts = await db
            .collection('carts')              // Koleksiyon: "carts"
            .find({})                         // Herkesi getir
            .sort({ createdAt: -1 })          // En son eklenen en üstte
            .toArray();                       // Sonuçları diziye çevir

        // 🟢 7. JSON olarak tüm sepet verisini döndür
        return NextResponse.json(carts);
    } catch (error) {
        // ❌ 8. Token geçersiz veya verify başarısızsa → 403
        return NextResponse.json({ message: 'Hatalı Token' }, { status: 403 });
    }
}
/*🧠 Kavramsal Özet
    Aşama	Ne Yapılıyor?
1️⃣	Bearer token alınır
2️⃣	Token yoksa → 401 döndürülür
3️⃣	JWT çözülür (kimlik doğrulama)
4️⃣	isAdmin flag'i kontrol edilir
5️⃣	MongoDB bağlantısı açılır
6️⃣	carts koleksiyonundaki tüm kayıtlar alınır
7️⃣	Kayıtlar frontend'e JSON olarak döndürülür
❌ Token hatalıysa → 403 hata mesajı verilir*/