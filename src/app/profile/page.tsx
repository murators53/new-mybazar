"use client";

import LoadingScreen from "@/components/LoadingScreen";
import { useAuthStore } from "@/store/authStore";
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
      if(isLoading) return;
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

        const data = await res.json();
        // Gelen JSON verisini JavaScript objesine çeviriyoruz yani body kismini
        //   console.log("data", data);
        //  {id: 1, email: 'asd@asd', iat: 1743507551, exp: 1743508451}

        setProfile(data); // Profile state'ini güncelliyoruz → artık kullanıcının verilerine sahibiz
      } catch (err) {
        console.log("Profil alınamadı:", err);
        router.push("/login");
      }
    };

    fetchProfile();
  }, [accessToken]);
  // useEffect sadece accessToken değiştiğinde yeniden çalışır


   // 🧠 Oturum kontrolü daha bitmediyse kullanıcıyı bekletiyoruz
   if (isLoading) {
    return <div className="text-center py-10">⏳ Oturum kontrol ediliyor...</div>;
  }

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profil Bilgileri</h2>
      <p>
        <strong>ID:</strong> {profile.id}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      {profile.isAdmin && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
          <p className="font-bold text-yellow-800">🛡️ Yönetici Erişimi</p>
          <p>Admin paneline erişiminiz var.</p>
        </div>
      )}
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
