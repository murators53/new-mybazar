import mongoose from "mongoose"; 

export async function connectDb() {
  if (mongoose.connections[0].readyState) {
    return; 
  }

  try {
    await mongoose.connect(process.env.MONGO_URL!); 
    console.log("🟢 MongoDB bağlantısı başarılı");
  } catch (error) {
    console.error("🔴 MongoDB bağlantı hatası:", error); 
    throw new Error("Veritabanına bağlanılamadı"); 
  }
}
