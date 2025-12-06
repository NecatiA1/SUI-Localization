"use client";

import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation"; 

// --- React Icons ---
import { MdOutlineSportsScore } from "react-icons/md";
// İkon paketleri düzeltildi (fa6 ve fa ayrımı)
import { FaEarthAmericas } from "react-icons/fa6"; 
import { FaSearch } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

const STAR_COUNT = 30;

// --- MOCK DATA ---
const MOCK_COMPANIES = [
  { id: 1, name: "Cluster Alpha", city: "Istanbul", country: "Turkey", volume: 15200 },
  { id: 2, name: "Nexus Node", city: "New York", country: "USA", volume: 18500 },
  { id: 3, name: "Tokyo Grid", city: "Tokyo", country: "Japan", volume: 12800 },
  { id: 4, name: "London Bridge DAO", city: "London", country: "UK", volume: 10500 },
  { id: 5, name: "Berlin Core", city: "Berlin", country: "Germany", volume: 9300 },
  { id: 6, name: "Singapore Flow", city: "Singapore", country: "Singapore", volume: 8900 },
  { id: 7, name: "Sydney Chain", city: "Sydney", country: "Australia", volume: 4200 },
  { id: 8, name: "Dubai Link", city: "Dubai", country: "UAE", volume: 11000 },
  { id: 9, name: "Anatolia Sync", city: "Konya", country: "Turkey", volume: 7500 },
  { id: 10, name: "Aegean Net", city: "Izmir", country: "Turkey", volume: 6200 },
];

export default function Header() {
  const pathname = usePathname(); 
  const [hoveredLink, setHoveredLink] = useState(null);
  const [stars, setStars] = useState([]);
  
  // Search States
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const generatedStars = Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      opacity: Math.random() * 0.7 + 0.3,
    }));
    setStars(generatedStars);
  }, []);

  // --- ARAMA FİLTRELEME MANTIĞI ---
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [...MOCK_COMPANIES]
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 5);
    }

    const lowerQuery = searchQuery.toLowerCase();
    return MOCK_COMPANIES.filter(
      (item) =>
        item.city.toLowerCase().includes(lowerQuery) ||
        item.country.toLowerCase().includes(lowerQuery) ||
        item.name.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const navLinks = [
    { href: "/localization", label: "Localization Map", icon: <FaEarthAmericas size={20} /> },
    { href: "/", label: "Documentation", icon: <IoDocumentTextOutline size={22} /> },
  ];

  return (
    // --- GÜNCELLEME: Header Rengi ve Stili ---
    // Eski: bg-linear-to-r from-black via-violet-950 to-black
    // Yeni: bg-[#020617]/80 backdrop-blur-md border-b border-white/5 (Glassmorphism)
    <header className="relative w-full bg-linear-to-r from-black via-[rgb(26,6,81)] to-black text-white py-3 overflow-visible z-50">
      <nav className="relative max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* --- Logo / Brand --- */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-8 h-8 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          {/* Yazıya daha modern bir gradient ve letter-spacing eklendi */}
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-200 to-slate-400 bg-clip-text text-transparent hidden sm:block tracking-tight">
            SUI - Localization
          </span>
        </div>

        {/* --- SEARCH BAR (Sadece Localization Map sayfasında görünür) --- */}
        {pathname === "/localization" && (
          <div className="relative mx-4 flex-1 max-w-md hidden md:block group">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-3 text-slate-400 group-hover:text-purple-400 transition-colors" />
              {/* Input rengi header ile uyumlu hale getirildi */}
              <input
                type="text"
                placeholder="Search by City or Country..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder-slate-500 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
            </div>

            {/* --- DROPDOWN RESULTS --- */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 w-full mt-2 bg-[#0b0f19]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/50">
                <div className="px-4 py-2 bg-white/5 text-xs text-slate-400 font-semibold uppercase tracking-wider border-b border-white/5">
                  {searchQuery ? "Search Results" : "Top 5 Companies (Volume)"}
                </div>

                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors flex justify-between items-center group/item"
                        onClick={() => {
                          console.log("Selected:", item);
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-200 group-hover/item:text-purple-300 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {item.city}, {item.country}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-emerald-400 font-mono font-medium">
                            ${item.volume.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-600 uppercase">Volume</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No results found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Navigation --- */}
        <div className="flex items-center gap-2 shrink-0">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium border
                ${
                  pathname === link.href 
                  ? "bg-purple-500/10 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                  : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                }
                `}
              onMouseEnter={() => setHoveredLink(index)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <span className={`text-lg transition-transform duration-300 ${hoveredLink === index ? "scale-110" : "scale-100"}`}>
                {link.icon}
              </span>
              <span className="hidden lg:block">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      <style jsx>{`
        /* Scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </header>
  );
}