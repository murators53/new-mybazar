import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI environment variable is missing!");
}

export async function connectDb() {
  if (mongoose.connections[0].readyState) {
    // ✅ Eğer zaten bağlıysa tekrar bağlanma
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB bağlantısı başarılı");
  } catch (error) {
    console.error("❌ MongoDB bağlantı hatası:", error);
    throw new Error("Veritabanına bağlanılamadı");
  }
}
