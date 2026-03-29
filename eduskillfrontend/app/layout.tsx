import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eduskill - Learn and Build",
  description: "Interactive learning courses with AI chatbots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased selection:bg-black selection:text-white`}>
        <GoogleOAuthProvider clientId={clientId}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
