import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./provider/AuthProvider";



export const metadata: Metadata = {
  title: "orbit teams",
  description: "Role-based access control system build with Next.Js 16 & React.Js 19",
  keywords:["team","access controll"]
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate">
        <AuthProvider>
          {children}
          </AuthProvider>
        </body>
    </html>
  );
}
