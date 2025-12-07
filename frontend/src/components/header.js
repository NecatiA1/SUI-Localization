"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useGlobalStore from "../store/useGlobalStore";
import { motion, AnimatePresence } from "framer-motion";

// --- Icons ---
import { FaSearch, FaGlobeAmericas } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiHome4Line } from "react-icons/ri"; // Opsiyonel Home ikonu

export default function Header() {
  const pathname = usePathname();
  
  // --- ZUSTAND STORE ---
  const { cities, selectCity } = useGlobalStore();

  // --- LOCAL STATE ---
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Scroll takibi (Header arka planını yoğunlaştırmak için)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- FILTERING LOGIC ---
  const filteredResults = useMemo(() => {
    if (!cities || cities.length === 0) return [];

    if (!searchQuery.trim()) {
      // Varsayılan: En çok işlem yapılan ilk 5 şehir
      return [...cities]
        .sort((a, b) => (b.transactions || 0) - (a.transactions || 0))
        .slice(0, 5);
    }

    const lowerQuery = searchQuery.toLowerCase();
    return cities.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(lowerQuery) ||
        (item.region || "").toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, cities]);

  // --- ACTIONS ---
  const handleResultClick = (city) => {
    selectCity(city);
    setIsSearchFocused(false);
    setSearchQuery(city.name);
  };

  const navLinks = [
    { href: "/", label: "Home", icon: <RiHome4Line size={20} /> },
    { href: "/localization", label: "Localization Map", icon: <FaGlobeAmericas size={18} /> },
    { href: "/documentation", label: "Docs", icon: <IoDocumentTextOutline size={20} /> },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b 
        ${
          scrolled
            ? "bg-[#020617]/80 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* --- LOGO KISMI --- */}
        <Link href="/" className="group flex items-center gap-3 relative z-10">
        <div className="relative w-9 h-9">
         {/* Logo Glow Effect */}
        <div className="absolute inset-0 bg-purple-600 rounded-full blur-lg opacity-40 group-hover:opacity-75 transition-opacity duration-500" />
        <Image
        src="/logo.png"
        alt="Logo"
        fill
        className="object-contain relative z-10 drop-shadow-sm"
        priority
       />
        </div>
  
      {/* Gradyan Yapılmış Metin */}
      <span className="text-xl font-bold tracking-tight hidden sm:block bg-gradient-to-r from-blue-500 via-purple-200 to-purple-600 bg-clip-text text-transparent">
       Sui-Localization
      </span>
      </Link>

          {/* --- SEARCH BAR (Sadece Map Sayfasında veya İstersen Her Yerde) --- */}
          {pathname === "/localization" && (
            <div className="hidden md:block flex-1 max-w-lg mx-8 relative z-50">
              <div className="relative group">
                {/* Input Glow */}
                <div 
                    className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500 ${isSearchFocused ? 'opacity-75' : ''}`}
                ></div>
                
                <div className="relative flex items-center bg-[#0b0f19] rounded-full border border-slate-700/50 overflow-hidden focus-within:border-purple-500/50 transition-colors">
                  <div className="pl-4 text-slate-400">
                    <FaSearch />
                  </div>
                  <input
                    type="text"
                    placeholder="Search city, region or country..."
                    className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 px-3 py-2.5 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  />
                </div>

                {/* --- DROPDOWN RESULTS --- */}
                <AnimatePresence>
                  {isSearchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full mt-3 bg-[#0b0f19]/95 backdrop-blur-2xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/5"
                    >
                      <div className="px-4 py-2 bg-white/5 text-[10px] font-bold text-purple-400 uppercase tracking-widest border-b border-white/5">
                        {searchQuery ? "Search Results" : "Most Active Regions"}
                      </div>

                      <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {filteredResults.length > 0 ? (
                          filteredResults.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleResultClick(item)}
                              className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors flex justify-between items-center group/item"
                            >
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-200 group-hover/item:text-purple-300 transition-colors">
                                  {item.name}
                                </span>
                                <span className="text-xs text-slate-500 group-hover/item:text-slate-400">
                                  {item.region}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-emerald-400 font-mono font-bold bg-emerald-400/10 px-2 py-0.5 rounded">
                                  {item.transactions ? item.transactions.toLocaleString() : 0}
                                </div>
                                <div className="text-[10px] text-slate-600 mt-0.5">TXNS</div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-6 text-center text-sm text-slate-500">
                            {cities.length === 0 ? (
                              <span className="animate-pulse">Loading network data...</span>
                            ) : (
                              "No matching location found."
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* --- NAV LINKS --- */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 group overflow-hidden
                    ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-white"
                    }
                  `}
                >
                  {/* Active Background Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 border border-white/10 rounded-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover Light Effect */}
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <span className={`relative z-10 flex items-center gap-2 ${isActive ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : ""}`}>
                    {link.icon}
                    <span className="hidden lg:block">{link.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

        </div>
      </header>
      
      {/* Scrollbar Style Injection */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7c3aed;
        }
      `}</style>
    </>
  );
}