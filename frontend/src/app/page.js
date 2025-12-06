
"use client";

import React from "react";
import Link from "next/link";
// İkon paketini yüklemediysen terminale: npm install react-icons
import { FaArrowRight, FaGlobeAmericas, FaShieldAlt, FaNetworkWired } from "react-icons/fa";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen w-full bg-[#020617] text-white overflow-hidden selection:bg-purple-500/30">
      
      {/* --- ARKA PLAN EFEKTLERİ --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] animate-pulse delay-1000"></div>
      </div>

      {/* --- ANA İÇERİK --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)]">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-8 hover:bg-white/10 transition-colors cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Live Network Activity
        </div>

        {/* Başlık */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="block text-white">Visualize the</span>
          <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-white bg-clip-text text-transparent">
            SUI Blockchain
          </span>
        </h1>

        {/* Açıklama */}
        <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          Real-time geographical tracking of SUI transactions, security scoring for regions, and detailed DAO community analysis. All in one interactive 3D globe.
        </p>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <Link 
            href="/localization"
            className="group relative px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center gap-2"
          >
            Launch Map
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/" // Eğer Documentation ana sayfadaysa burayı değiştirebilirsin
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-full font-semibold transition-all backdrop-blur-sm flex items-center justify-center"
          >
            Read Documentation
          </Link>
        </div>

        {/* --- ÖZELLİK KARTLARI --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500">
          
          <div className="group p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-purple-500/30 transition-all hover:bg-slate-900/60 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaGlobeAmericas className="text-blue-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Global Tracking</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Monitor transactions across the globe with precise geolocation data tailored for the SUI network ecosystem.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-purple-500/30 transition-all hover:bg-slate-900/60 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaShieldAlt className="text-purple-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Risk Scoring</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-driven security analysis that assigns trust scores to regions based on transaction anomalies and volume.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-purple-500/30 transition-all hover:bg-slate-900/60 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaNetworkWired className="text-emerald-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">DAO Clusters</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Identify and analyze major decentralized autonomous organizations and their transaction patterns.
            </p>
          </div>

        </div>
      </main>
      
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </div>
  );
}