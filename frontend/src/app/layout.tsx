import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CropChain — Agricultural Intelligence",
  description: "ML-verified crop intelligence for Indian farmers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(13,20,13,0.95)",
              color: "#00ff88",
              border: "1px solid rgba(0,255,136,0.3)",
              borderRadius: "12px",
              fontFamily: "Syne, sans-serif",
              backdropFilter: "blur(20px)",
            },
          }}
        />
      </body>
    </html>
  );
}
