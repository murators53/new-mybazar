// app/(admin)/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Skeleton from "@/components/ui/Skeleton";
import { toast } from "sonner";
import DeleteModal from "@/components/ui/DeleteModal";

type User = {
  _id: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/admin", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Kullanıcılar alınamadı");
        const data = await res.json();
        setUsers(
          data.sort((a: User, b: User) => {
            if (a.isAdmin === b.isAdmin) return 0;
            return a.isAdmin ? -1 : 1;
          })
        );
      } catch (err) {
        console.error("Kullanıcıları çekme hatası:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [accessToken]);

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
  
    try {
      const res = await fetch(`/api/users/admin/${selectedUserId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Kullanıcı silinemedi");
  
      setUsers((prev) => prev.filter((user) => user._id !== selectedUserId));
      toast.success("✅ Kullanıcı başarıyla silindi");
    } catch (err: any) {
      console.error("Kullanıcı silme hatası:", err);
      toast.error(`🚫 ${err.message}`);
    } finally {
      setShowDeleteModal(false);
      setSelectedUserId(null);
    }
  };
  

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-zinc-900 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">👥 Kullanıcılar</h2>

        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Kullanıcılar yüklenemedi." type="network" />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-zinc-900 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">👥 Kullanıcılar</h2>

      <div className="overflow-x-auto">
        {users.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            Henüz kayıtlı bir kullanıcı yok.
          </div>
        ) : (
          <table className="min-w-full border">
            <thead className="bg-gray-100 dark:bg-zinc-800">
              <tr>
                <th className="p-3 text-left font-semibold">Email</th>
                <th className="p-3 text-left font-semibold">Yetki</th>
                <th className="p-3 text-left font-semibold">Kayıt Tarihi</th>
                <th className="p-3 text-left font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <td className="p-3 max-w-[200px] truncate">{user.email}</td>
                  <td className="p-3">
                    {user.isAdmin ? (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full dark:bg-orange-900 dark:text-orange-200">
                        Kullanıcı
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {new Date(user.createdAt).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3">
                    {!user.isAdmin && (
                      <button
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition"
                        onClick={() => {
                          setSelectedUserId(user._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        🗑️ Sil
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <DeleteModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUserId(null);
        }}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
