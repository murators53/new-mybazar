import mongoose, { Schema, model, models } from "mongoose";

const orderSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    cartItems: [
      {
        id: { type: String, required: true }, // Ürün ID'si
        title: { type: String, required: true }, // Ürün adı
        price: { type: Number, required: true }, // Ürün fiyatı
        quantity: { type: Number, required: true }, // Adet
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // createdAt, updatedAt otomatik eklenir
);

// Eğer model daha önce tanımlıysa onu kullan, yoksa yeni oluştur
const Order = models.Order || model("Order", orderSchema);

export default Order;
