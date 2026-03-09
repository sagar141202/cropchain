import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CropChain",
  description: "AI-powered agricultural intelligence for Indian farmers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: {
            background: "#fff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "0.875rem",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          },
          success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          `
        }} />
      </body>
    </html>
  );
}
