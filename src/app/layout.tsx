import "./globals.css";
import { TokenLoder } from "@/components/TokenLoader";
import Providers from "./providers";
import ThemeWrapper from "./providers/ThemeWrapper";

export const metadata = {
  title: "MyBāzar",
  description: "Modern, hızlı ve keyifli bir alışveriş deneyimi",
};

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 🌑 dark mode flash engelleyici */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = JSON.parse(localStorage.getItem("theme-storage"));
                  if (theme?.state?.theme === "dark") {
                    document.documentElement.classList.add("dark");
                    console.log("immedately invoked function expression");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeWrapper>
          <Providers>
            <TokenLoder />
            {children}
          </Providers>
        </ThemeWrapper>
      </body>
    </html>
  );
}
