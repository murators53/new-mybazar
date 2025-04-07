
import Navbar from "@/components/Navbar";
import "./globals.css";
import { TokenLoder } from "@/components/TokenLoader";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import ThemeWrapper from "./providers/ThemeWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeWrapper>
      <Providers>
        <TokenLoder />
        <Navbar />
        <Toaster position="top-right" />
        {children}
      </Providers>
    </ThemeWrapper>
  );
}
