

export type CartItem = {
    id: string;
    title: string;
    image: string;
    price: number;
    quantity: number;
}


export type ToastFn = {
    success: (msg: string) => void;
    error: (msg: string) => void;
};

export type CartStoreSlice = {
    cart: CartItem[];
    increaseQty: (id: string) => void;
    decreaseQty: (id: string) => void;
    removeFromCart: (id: string) => void;
    totalPrice: () => number;
    clearCart: () => void;
}