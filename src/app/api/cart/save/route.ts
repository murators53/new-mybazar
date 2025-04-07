import { NextRequest, NextResponse } from 'next/server';
// ➡️ NextRequest: API route'una gelen isteği temsil eder.
// ➡️ NextResponse: API’den dönecek yanıtı oluşturmak için kullanılır.
import clientPromise from "@/lib/mongo";
// ➡️ clientPromise: MongoDB bağlantısı sağlayan Promise dönen fonksiyon
import jwt from 'jsonwebtoken';
// ➡️ jsonwebtoken: JWT token’ı verify, çözmek ve iç.dki kull. bilgilerini elde et. için kul.

// POST isteklerini yakalayan bir API Route handler
export async function POST(req: NextRequest) {
    // 🛡️ 1. Authorization Header'dan token'ı al
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];// "Bearer <token>" → token kısmını ayırır

    // 🚫 Eğer token yoksa, 401 (Unauthorized) hatası dön
    if (!token) {
        return NextResponse.json({ message: "Token Yok" }, { status: 401 });
    }
    try {
        // 🔓 2. Token'ı çöz (decode et), geçersizse hata fırlatır

        //Token geçerliyse içindeki bilgileri (id, email vs.) çözer.
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
        //Backend’te token’ı üretmek ve doğr.mk için kullnlan gizli anahtar

        // 📦 3. İstek body’sinden gelen sepet verisini al
        const { cartItems } = await req.json();

        // ❌ 4. Sepet verisi yoksa ya da dizi değilse, 400 (Bad Request) dön
        if (!cartItems || !Array.isArray(cartItems)) {
            return NextResponse.json({ message: 'Geçersiz seper verisi ' }, { status: 400 });
        }//verinin gerçekten dizi olup olmadığını kontrol eder

        // 🔌🔌 5. MongoDB bağlantısını aç/ istemcisini(client) i alir
        const client = await clientPromise;
        //myshop isimli veritabanına bağlanır.
        const db = client.db('myshop');
        //carts adında bir koleksiyon kullanır (yoksa oluşturur).
        const carts = db.collection('carts');

        // 📝 6. Sepet verisini kullanıcıya ait şekilde kaydet
        await carts.insertOne({//oturum açmış kullanıcıya özel sepet bilgisidir.
            userId: decoded.id,
            email: decoded.email,
            cartItems,//cartItems (ürün listesi)
            createdAt: new Date(),//kayit zamani
        })

        // ✅ 7. Başarılı işlem mesajı
        return NextResponse.json({ message: 'Sepet kaydedildi ✅' });
    } catch (error) {
        // 🔐 JWT doğrulama hatası → 403 Forbidden
        return NextResponse.json({ message: 'Token geçersiz' }, { status: 403 });
    }
    /*🧪 Test Durumları
    Durum	Beklenen Cevap
    Token yok	401 - "Token yok"
    Token geçersiz	403 - "Token geçersiz"
    cartItems yok	400 - "Geçersiz sepet verisi"
    Her şey doğruysa	200 - "Sepet kaydedildi ✅" 
    */

}