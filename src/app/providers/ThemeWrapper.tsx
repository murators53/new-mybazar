// components/ThemeWrapper.tsx
"use client";

import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme, transitionAt } = useThemeStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!transitionAt) return;

    const now = Date.now();
    const delay = transitionAt - now;

    const timeout = setTimeout(() => {
      setReady(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [transitionAt]);

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body
        className={`${
          theme === "dark"
            ? "dark:bg-zinc-900 dark:text-white"
            : "bg-white text-black"
        } ${ready ? "transition-colors duration-500" : ""}`}
      >
        {children}
      </body>
    </html>
  );
}
