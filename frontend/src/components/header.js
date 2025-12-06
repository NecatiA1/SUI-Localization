"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";



// --- React Icons ---
import { MdOutlineSportsScore } from "react-icons/md";
import { FaEarthAmericas } from "react-icons/fa6";
import { RiFlashlightLine } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";

const STAR_COUNT = 30;

export default function Header() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [stars, setStars] = useState([]);

  // Generate stars on client side only
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

  // Navigation links with icons
  const navLinks = [
    { href: "/localization", label: "Localization Map", icon: <FaEarthAmericas size={20} /> },
    { href: "/scoreMap", label: "Localization Score Map", icon: <MdOutlineSportsScore size={22} /> },
    { href: "/", label: "Documantation", icon: <IoDocumentTextOutline  size={22} /> },
  ];

  return (
    <header className="relative w-full bg-linear-to-r from-black via-purple-950 to-black text-white py-4 overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.animationDelay,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Scanning Line */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute h-px w-full bg-linear-to-r from-transparent via-cyan-400 to-transparent animate-scan" />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-blue-900/20 via-purple-900/20 to-black/20 pointer-events-none" />

      <nav className="relative max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <span className="text-2xl font-bold bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SUI - Localization
              </span>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md transition-all duration-200 text-sm border border-transparent
                    ${hoveredLink === index ? "bg-white/10 text-gray-200" : "border-gray-200 bg-white/20 text-gray-300"}
                    hover:bg-white/15`}
                  onMouseEnter={() => setHoveredLink(index)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {/* Icon */}
                  <span className="text-lg">
                    {link.icon}
                  </span>
                
                  {/* Label */}
                  <span className="font-medium tracking-wide">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
        </nav>
          
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes border-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes particle {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-20px) scale(0); opacity: 0; }
        }

        .animate-scan { animation: scan 4s linear infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-border-flow { background-size: 200% 200%; animation: border-flow 2s ease infinite; }
        .animate-particle { animation: particle 1s ease-out infinite; }
      `}</style>
    </header>
  );
}
