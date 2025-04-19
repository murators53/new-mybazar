import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number;
    email: string;
    isAdmin: boolean;
}

export async function GET() {
    const cookiesStore = cookies();
    const refreshToken = cookiesStore.get("refreshToken")?.value;


    if (!refreshToken) {
        return NextResponse.json({ message: 'Refresh token missing' }, { status: 401 })
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as JwtPayload;

        const newAccessToken = jwt.sign(
            { id: decoded.id, email: decoded.email, isAdmin: decoded.isAdmin },
            process.env.JWT_SECRET!,
            { expiresIn: '15m' },
        );

        return NextResponse.json({ accessToken: newAccessToken, email: decoded.email, isAdmin: decoded.isAdmin });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
    }
}