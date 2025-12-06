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
      <body className="bg-gray-100">
        
        <Header />

        <main className="min-h-screen px-6 py-6">
          {children}
        </main>

      </body>
    </html>
  );
}


