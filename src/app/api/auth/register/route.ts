import { NextResponse } from "next/server";
// Şifreleri hash'leyerek (şifreleyerek) veritabanına güvenli şekilde kaydederiz
import bcrypt from 'bcryptjs';
// Daha önce tanımladığımız MongoDB bağlantı dosyasını kullanıyoruz
import clientPromise from '@/lib/mongo';

// RAM'de kullanıcıları saklayabilirsin.
// Dikkat: Sunucu yeniden başlatıldığında bu liste sıfırlanır! (Kalıcı değildir.)
let users: { id: number; email: string; hashedPassword: string }[] = [];

//Kullanıcı register formdan veri gönderdiğinde burası çalışır. POST metodunu dinliyor.
export async function POST(req: Request) {
    const { email, password } = await req.json();//İstek body’sindeki email ve password alınır (JSON olarak)

    //clientPromise global bir bağlantı nesnesi verse bile, kullanım kısmı (db ve collection) tekrar çağrılmalı.
    const client = await clientPromise;//clientPromise ile bağlantıyı alıyoruz
    //"myshop" adında bir veritabanı açıyoruz (yoksa otomatik oluşturulur)
    const db = client.db("myshop");
    // users adında bir koleksiyon (collection = tablo gibi) tanımlıyoruz
    const usersCollection = db.collection("users");
    
    // const userExists = users.find((user) => user.email === email);//mongo db ONCESI
    
    //findOne({ email →email'e göre veri arar, Email alanı zaten kullanılmış mı diye kontrol ediyoruz
    const userExists = await usersCollection.findOne({ email });

    if (userExists) {//Bu kullanıcıya "zaten kayıtlısınız" uyarısı vermek için kullanılır
        return NextResponse.json({ message: 'Email zaten kayıtlı' }, { status: 400 })
    }

    
    //? bcrypt.hash(şifre, tuzSayısı) -> Salt + Hash işlemi 
    //* Tuz: şifreye eklenen rastgelelik Hash’lenmiş şifre artık veritabanına yazılmaya hazır
    const hashedPassword: string = await bcrypt.hash(password, 10);
    // 10	Orta güvenlik (default, önerilen) ✅ 📌 10 = 2¹⁰ = 1024 round → her hash işlemi 1024 tekrar
    // 12+	Daha güvenli ama daha yavaş
    // 8-	Daha hızlı ama güvenliği düşer ❌
    // await → Asenkron işlem await ile işlemin bitmesi beklenir
    // Hash işlemi CPU’ya yük bindiren ağır bir işlemdir


    const newUser = {
        email, //Email ve hashlenmiş şifreyi tutar
        hashedPassword,
        createAt: new Date(),//createdAt: kullanıcının kayıt olduğu zamanı saklar
        isAdmin: false, // varsayilan olarak false
    }

    await usersCollection.insertOne(newUser);//insertOne() sadece tek bir döküman ekler
    // Hazırladığımız newUser nesnesini MongoDB’ye kaydediyoruz


    let registerControlPaket = 'test icin Register auth\'dan geldi REGISTER ROUTE API';//test icin 
    return NextResponse.json({ message: 'Kayıt başarılı!', registerControlPaket });
}