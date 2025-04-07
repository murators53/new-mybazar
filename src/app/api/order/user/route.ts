import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongo';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    //Yani giriş yapılmamışsa → 401 Unauthorized döner.
    if (!token) {
        return NextResponse.json({ message: 'Token eksik' }, { status: 401 });
    }
    
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
        const client = await clientPromise;
        const db = client.db('myshop');//Veritabanına bağlanılır.
    
        const orders = await db
          .collection('orders')
          .find({ userId: decoded.id })
          .sort({ createdAt: -1 })
          .toArray();
    
        return NextResponse.json(orders);
      } catch (err) {
        return NextResponse.json({ message: 'Geçersiz token' }, { status: 403 });
      }
}