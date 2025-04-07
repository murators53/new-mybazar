import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
    // const data = req.headers.get("paket")//profile fetch istegindeki paket adindaki degiskenle test icin
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: "Token missing" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        // Buradaki JWT_SECRET → .env dosyasından gelir. Token geçerli mi kontrol etmek
        // Yani imzanın kalemi gibi düşün: "Bunu sadece ben yazabilirim" dediğin mührün.
        return NextResponse.json(decoded);
        // Token geçerliyse, içerisindeki payload'ı (örneğin: { email, userId }) frontend'e gönderiyoruz    } catch (error) {
    } catch (err) {
        return NextResponse.json({ message: "Invalid Token" }, { status: 401 })
    }
    let ProfiletestControl = 'bende profile API route\'ndan geldim '
    // return NextResponse.json({ProfiletestControl});
}