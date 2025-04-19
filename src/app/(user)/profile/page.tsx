"use client";

import ErrorMessage from "@/components/ui/ErrorMessage";
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

  useEffect(() => {
    if (!accessToken) return;
    const fetchProfile = async () => {
      if (isLoading) return;
      if (!accessToken) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            paket: "ben profilden app/ profile den test icin gonderildim",
          },
        });

        if (!res.ok) {
          throw new Error("Profil alınamadı"); // ❌ error gösterilecek
        }

        if (process.env.NODE_ENV === "development") {
          await new Promise((resolve) => setTimeout(resolve, 444));
        }

        const data = await res.json();

        setProfile(data);
      } catch (err) {
        console.log("❌ Profil alınamadı:", err);
        setHasError(true);
      }
    };

    fetchProfile();
  }, [accessToken]);

  if (hasError) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <ErrorMessage
          type="network"
          message="Profil bilgileri alınamadı."
          statusCode={401}
        />
      </div>
    );
  }

  if (!profile) return <ProfileSkeleton />;

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
