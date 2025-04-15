"use client";

import ProfileSkeleton from "@/components/ui/skeletons/ProfileSkeleton";
import { useAuthStore } from "@/store/authStore";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProfileData = {
  id?: string;
  email: string;
  isAdmin?: boolean;
};

const ProfilePage = () => {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [hasError, setHasError] = useState(false);

  /*  
  🧠 Özet Akış:
    🟢 Login ol → accessToken (RAM) + refreshToken (cookie)
    🔄 Sayfa yenilenince:
    🔸 RAM sıfırlanır → accessToken gider ❌
    🔸 Ama cookie kalır → refreshToken hâlâ tarayıcıda ✅
    ➡️ useEffect → /api/auth/refresh → yeni accessToken al ✅
    ➡️ useAuthStore().setAccessToken(...) ile yeniden yaz RAM'e ✅
  */

  useEffect(() => {
    if (!accessToken) return;
    // Component ilk yüklendiğinde veya accessToken değiştiğinde çalışacak
    const fetchProfile = async () => {
      // 🛑 Token yüklenmeden çağrı yapma!
      if (isLoading) return;
      if (!accessToken) {
        router.push("/login");
        return;
      }
      //Eger accessToken yoksa fetch işlemini yapma -> çünkü yetkisiz erişim olur

      // Backend'e istek atıyoruz ve JWT'yi Authorization başlığına ekliyoruz
      // Böylece sunucu kullanıcının yetkili olduğunu anlayabilir
      try {
        const res = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            paket: "ben profilden app/ profile den test icin gonderildim",
          },
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        if (process.env.NODE_ENV === 'development') {
        }

        const data = await res.json();
        // Gelen JSON verisini JavaScript objesine çeviriyoruz yani body kismini
        //   console.log("data", data);
        //  {id: 1, email: 'asd@asd', iat: 1743507551, exp: 1743508451}

        setProfile(data); // Profile state'ini güncelliyoruz → artık kullanıcının verilerine sahibiz
      } catch (err) {
        console.log("Profil alınamadı:", err);
        setHasError(true);
        router.push("/login");
      }
    };

    fetchProfile();
  }, [accessToken]);
  // useEffect sadece accessToken değiştiğinde yeniden çalışır
  
  if (hasError) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-8">
        Profil bilgileri alınamadı. Lütfen tekrar giriş yapınız.
      </div>
    );
  }
  
  if (!profile) return <ProfileSkeleton/>;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-gray-50 dark:bg-zinc-950 ">
      {" "}
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-zinc-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-600 text-white rounded-full p-3 shadow-md">
            <User size={36} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Profil Bilgileri</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kullanıcı bilgileriniz aşağıda listelenmiştir
            </p>
          </div>
        </div>

        <div className="space-y-3 text-gray-800 dark:text-gray-200 text-base">
          <div className="flex gap-2">
            <span className="font-semibold w-20 ps-[22px]">ID:</span>
            <span className="break-all ">{profile.id}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold w-20 ps-[22px]">Email:</span>
            <span>{profile.email}</span>
          </div>

          {profile.isAdmin && (
            <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 rounded text-yellow-800 dark:text-yellow-200">
              <p className="font-bold">🛡️ Yönetici Erişimi</p>
              <p>Admin paneline erişiminiz aktif.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

/* 
Şunu görürsün:

Response {
  body: ReadableStream,
  headers: Headers,
  ok: true,
  status: 200,
  statusText: "OK",
  type: "basic",
  url: "http://localhost:3000/api/auth/profile",
  ...
}

🔍 res.json() Ne Yapar?

const data = await res.json();

Bu satır:

    res.body içindeki JSON formatındaki ham veriyi

    JavaScript nesnesine çevirir (parse eder)
    
*/
