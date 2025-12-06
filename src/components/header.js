"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-gray-900 text-white py-4">
      <nav className="max-w-5xl mx-auto flex items-center justify-center gap-6">
        
        <Link 
          href="/" 
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          Home
        </Link>

        <Link 
          href="/worldPin" 
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          World Pin
        </Link>

        <Link 
          href="/transaction" 
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          Transaction
        </Link>

      </nav>
    </header>
  );
}
