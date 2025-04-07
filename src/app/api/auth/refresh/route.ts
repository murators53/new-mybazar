import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number;
    email: string;
    isAdmin: boolean;
}

// Bu bir GET endpoint’i → /api/auth/refresh adresine gelen GET isteklerini karşılar
export async function GET() {
    // Sunucu tarafında gelen istek içindeki cookie'lere erişiyoruz
    // httpOnly cookie'de bulunan refreshToken'ı alıyoruz
    const cookiesStore = cookies();
    const refreshToken = cookiesStore.get("refreshToken")?.value;


    if (!refreshToken) {//Eğer refresh token yoksa → kullanıcı yetkisizdir → 401 döneriz
        return NextResponse.json({ message: 'Refresh token missing' }, { status: 401 })
    }

    try {
        //Token'ı doğruluyoruz. Eğer geçerliyse decoded içinde kullanıcının bilgileri olur
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as JwtPayload;
        
        //Geçerli refresh token sayesinde yeni bir access token üretiyoruz
        const newAccessToken = jwt.sign(
            { id: decoded.id, email: decoded.email, isAdmin: decoded.isAdmin },
            process.env.JWT_SECRET!,
            { expiresIn: '15m' },
        );
        //Kullanıcı kimliği ve email'i taşıyan yeni bir token, 15 dakika geçerli olacak şekilde imzalanıyor

        return NextResponse.json({ accessToken: newAccessToken, email:decoded.email });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
    }
    // ✅ cookies() ile sunucudaki refreshToken’a erişiyoruz
    // ✅ Geçerliyse yeni accessToken üretip JSON olarak gönderiyoruz

    /*  console.log("refresToken", refreshToken);
     let a = 'bos geldim'
     return NextResponse.json({ a }) */
}