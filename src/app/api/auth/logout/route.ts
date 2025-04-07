// ? 🎯 Hedef:
// Adım	Ne olacak?
// 1️⃣	accessToken (RAM - Zustand) silinecek
// 2️⃣	refreshToken (httpOnly cookie) sunucudan temizlenecek
// 3️⃣	Kullanıcı /login sayfasına yönlendirilecek

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
// Next.js App Router’da sunucu tarafında cookie işlemleri için kullanılır

//Bu route bir POST isteği bekliyor (yani kullanıcı logout düğmesine bastığında tetiklenir)
export async function POST() {
    // Sunucu tarafında gelen istek üzerinden cookie'lere erişiyoruz.
    const cookieStore = cookies();

    // refreshToken cookie’sini temizle
    cookies().set('refreshToken', '', {
        httpOnly: true,
        path: '/',
        expires: new Date(0)
    })
    // refreshToken değerini boş string ('') yapıyoruz
    // expires: new Date(0) → bu cookie'nin geçerlilik süresini sıfırlıyor (yani tarayıcıda silinir)
    // httpOnly: true → cookie sadece sunucu tarafında silinebilir
    // path: '/' → hangi route’lardan geçerli olduğunu belirtir (genel olarak silmek için '/' kullanılır)
    //✅ Bu işlem sonucunda refreshToken tarayıcıdan temizlenmiş olur → middleware artık seni tanımaz!

    return NextResponse.json({ message: 'Logged out succesfly' });
}//Kullanıcıya JSON şeklinde yanıt veriyoruz