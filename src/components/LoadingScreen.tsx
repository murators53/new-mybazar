// components/LoadingScreen.tsx
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900 flex items-center justify-center">
      <div className="text-xl animate-pulse font-semibold text-blue-700">
        Oturum kontrol ediliyor...
      </div>
    </div>
  );
}
