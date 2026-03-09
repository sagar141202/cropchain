import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
export const metadata: Metadata = {
  title: "CropChain — Agricultural Intelligence",
  description: "ML-verified crop intelligence for Indian farmers",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mesh-bg" />
        <AuthProvider>
          <div className="page-content">{children}</div>
        </AuthProvider>
        <Toaster position="top-center" toastOptions={{
          style: {
            background: "var(--glass)", backdropFilter: "blur(20px)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-1)", borderRadius: "14px",
            boxShadow: "var(--shadow)", fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px", fontWeight: 500,
          },
        }} />
      </body>
    </html>
  );
}
