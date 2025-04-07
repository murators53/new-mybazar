import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongo';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) return NextResponse.json({ message: 'Token eksik' }, { status: 401 });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded.isAdmin) {
      return NextResponse.json({ message: 'Yönetici değilsiniz' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('myshop');

    const orders = await db
      .collection('orders')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ message: 'Token geçersiz' }, { status: 403 });
  }
}
