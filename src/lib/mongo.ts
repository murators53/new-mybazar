// 📦 lib/mongo.ts dosyası sayesinde tüm projede tek bağlantı noktasıyla
//  MongoDB kullanabileceğiz.
//  lib/mongo.ts → her yerden ulaşılabilir

// MongoDB bağlantısı kurmak için MongoClient sınıfını import ediyoruz
import { MongoClient } from 'mongodb'


const uri = process.env.MONGODB_URI!; // ❗ `!` işareti, "kesin tanımlı" demektir, yani TS uyarı vermez
// .env.local dosyanda tanımlı olan MongoDB bağlantı URI'si burada alınır.

// 3️⃣ Opsiyonel bağlantı ayarları (şimdilik boş geçiyoruz)
const options = {};

// 4️⃣ client: Mongo bağlantı nesnesi, ilk başta tanımsız
let client;

// 5️⃣ clientPromise: Mongo bağlantı işleminin sonucunu (Promise) tutacak değişken
let clientPromise: Promise<MongoClient>;
// Bu iki değişken, MongoDB istemcimizi ve // bağlantı sözünü (Promise) saklamak için tanımlanıyor

// 6️⃣ TypeScript'e "global nesnesine özel bir değişken ekleyeceğim" diyoruz
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {//
    throw new Error('Lütfen MONGODB_URI .env.local dosyasına ekleyin...')
}//Geliştirme esnasında "bağlantı hatası" yerine net bir mesajla karşılaşırsın

/*👇 Kısaca 3 ortam türü vardır:
Ortam	Değeri	Açıklama
Geliştirme	development	Kod yazarken, npm run dev ile
Test	test	Otomatik testlerde
Üretim	production	Gerçek kullanıcıya sunulmuş hali, next build && start */
// "Next.js’te development modunda hot reload olduğu için 
// MongoDB bağlantısını tekrar tekrar açarsan hata alırsın. 
// Bu yüzden bağlantıyı bir kere açıp globalde saklaman gerekir."

// Eğer bağlantı daha önce açılmışsa:
if (process.env.NODE_ENV === 'development') {//Next.js bunu otomatik olarak kendisi tanımlar.
    // ❤️ Bu blok, modern Next.js + MongoDB yapısında bağlantı yönetiminin kalbidir. 
    // Hot reload durumları için (development'de)
    if (!global._mongoClientPromise) {//Mongo bağlantısı açılmadıysa yeni bir tane oluştur
        // 8️⃣ Yeni bir MongoClient nesnesi oluştur (henüz bağlanmadı)          global._mongoClientPromise = 
        client = new MongoClient(uri, options);

        // 9️⃣ MongoClient ile bağlantı kur ve sonucu global'e kaydet (promise olarak)
        global._mongoClientPromise = client.connect();
        //Amaç: npm run dev ile her dosya değişiminde yeni bağlantı
        //açılmasın, zaten açık olan bağlantı tekrar kullanılsın.
    }
    // 🔟 Her durumda global değişkende bağlantı var → onu local değişkene aktar
    clientPromise = global._mongoClientPromise;
} else {//PRODUCTION (Canlı Ortam) İçin Kullanım:
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
    // 🚀 Canlı ortamda (örneğin Vercel), global gibi şeyler çalışmaz çünkü her istek ayrı çalışır.
    // Bu yüzden her bağlantı için yeni MongoClient oluşturulur.
    // ❗ Bu performans açısından bir sorun değildir çünkü production'da Hot Reload yoktur.
}

// 1️⃣1️⃣ Artık bu bağlantıyı diğer dosyalarda  await clientPromise şeklinde kullanabiliriz
export default clientPromise;

/* 
🧠 Açıklamalı Parçalama:
MONGODB_URI=mongodb+srv://muratUser:123456@cluster0.wxyz.mongodb.net/myAppDB?retryWrites=true&w=majority
MONGODB_URI=                             # Değişkenin adı (process.env ile erişilir)
mongodb+srv://                           # MongoDB Atlas URI protokolü
kullaniciAdi:sifre                      # MongoDB kullanıcı adı ve şifren
@cluster0.mongodb.net                   # MongoDB Atlas'taki sunucu adresin
/veritabaniAdi                          # Bağlanmak istediğin veritabanı adı
?retryWrites=true&w=majority            # Opsiyonel parametreler
*/