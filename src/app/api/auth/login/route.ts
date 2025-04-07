import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';//Next.js 13 + için cookie işlemleri burada yapılı
import bcrypt from 'bcryptjs';// Güvenlik açısından **şifreleri asla düz metin olarak saklamamalıyız**.
import clientPromise from '@/lib/mongo';

// Sahte kullanıcı (normalde DB'den gelir)
/* const user = {
    id: 1,
    email: 'asd@asd',
    password: '123qwe',
}; */

//MongoDb olduguicin artik gerek kalmadi
//let users: { id: number; email: string; hashedPassword: string }[] = [];
//users[] → RAM’de tutuluyor ki o zaman sayfa yenilemeden ilerlemelisin

export async function POST(req: Request) {
    // const data = await req.json()
    const { email, password, paket } = await req.json();
    /* // ❌ Email veya şifre yanlışsa, 401 dön sahte kullanici icin ilk baslangic icin kontroldu bu if yapisi
    if (email !== user.email || password !== user.password) {
        return NextResponse.json({ message: `Invalid credentials` }, { status: 401 })
    } */
    //clientPromise global bir bağlantı nesnesi verse bile, kullanım kısmı (db ve collection) tekrar çağrılmalı.
    //Ortak bir dosyada (senin clientPromise) MongoDB bağlntisnı tek birkez başlatırsın, 
    //ama onu kullanan her yerde db.collection(...) çağrısı yine gerekir. 
    //Çünkü bu bir "bağlantı" değil, referanstır.
    const client = await clientPromise;
    const db = client.db("myshop");
    const userCollection = db.collection("users")

    // Kullanıcı var mı kontrolü
    // const user = users.find((u) => u.email === email);
    const user = await userCollection.findOne({ email });
    if (!user) {
        return NextResponse.json({ message: "Email bulunamadı" }, { status: 401 });
    };

    // Şifre karşılaştırması (bcrypt hash check) 
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    //bcrypt.compare() → düz şifreyi hash'le karşılaştırmak için kullanılır
    if (!isPasswordValid) {
        return NextResponse.json({ message: 'Şifre hatalı' }, { status: 401 });
    }

    // ✅ Giriş başarılıysa → JWT üret
    const accessToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
        },//payoad kullanici bilgileri
        process.env.JWT_SECRET!, // .env icindeki gizli anahtar
        {
            expiresIn: '15m', // access token 15 dakika gecerli
        }
    );

    const refreshToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: '7d'
        }
    )

    // 🍪 refreshToken’ı httpOnly cookie’ye yaz (güvenli saklama)
    cookies().set('refreshToken', refreshToken, {
        httpOnly: true,//XSS'e karsi koruma JS erisemez
        path: '/', //Tum uyg.dad gecerli
        maxAge: 60 * 60 * 24 * 7, // 7 gun saniye cinsinden
    })

    let jwtApiRouteTestControl = 'Frontendden okuma testi icin yazildi API ROUTE auth loginden'
    // 🔐 accessToken'ide frontend’e JSON olarak dönülür
    return NextResponse.json({ accessToken, jwtApiRouteTestControl, email, refreshToken })
    // 🔐 Neden sadece accessToken dönüyoruz?
    // Çünkü refreshToken zaten cookie’de
    // Frontend sadece accessToken ile API istekleri yapacak
    // Eğer accessToken süresi dolarsa → TokenLoader gibi bir yapı refreshToken ile yenisini alır
}
/*🍪 3. İşte Burada refreshToken devreye giriyor
    accessToken: kısa ömürlü, RAM'de, sayfa yenilenince gider
    refreshToken: uzun ömürlü, httpOnly cookie içinde saklanır → tarayıcıdan silinmez, sayfa yenilenince kalır ✅

Bu yüzden sen:
    Sayfayı yenilsen bile
    TokenLoader sayesinde refreshToken ile yeni accessToken alınır
    Kullanıcı "giriş yapılmış gibi" görünmeye devam eder 🔥 
*/