import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SUI Localization",
  description: "Localization project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          min-h-screen 
          flex 
          bg-[hsl(258,76%,3%)]
          flex-col
        `}
      >
        <Header />

        {/* Kalan alanı dolduran içerik */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
