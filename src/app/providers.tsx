// Ürünleri API'den çekmek, Veri çekme, cache, loading/error yönetimi
"use client"; //bu dosyanın Client Component olduğunu belirtir.

// verileri daha performanslı, otomatik cache’li ve state management derdi olmadan yönetebiliyorsun.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
// QueryClient: Veri fetch işlemlerini yönetecek olan client objesini oluşturmak için.
// QueryClientProvider: Uygulamanın alt component’lerine React Query özelliğini sağlayan provider (sarmalayıcı).

//Yeni bir QueryClient örneği oluşturuyorsun.
//çeride cache, retry, refetch gibi tüm ayarlar bu client üzerinden yönetiliyor.
const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  //🧠 Ne? QueryClientProvider bileşeniyle tüm alt component’lere queryClient'ı tanıtıyorsun.
  // ✅ useQuery: // Sunucudan veri çekmek için kullanılır (GET istekleri gibi düşün).
  // ✅ useMutation:// Sunucuya veri göndermek, silmek, güncellemek için kullanılır (POST, PUT, DELETE gibi işlemler).
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        richColors
        expand
        duration={3000} // otomatik kapanma süresi
      />
    </QueryClientProvider>
  );
}
