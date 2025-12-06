"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  FaArrowRight, FaGlobeAmericas, FaShieldAlt, FaNetworkWired, 
  FaUserShield, FaCode, FaIndustry, FaMapMarkedAlt, FaCheckCircle 
} from "react-icons/fa";

// --- SCROLL REVEAL COMPONENT (Animasyonlu Görünüm) ---
const ScrollReveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.disconnect(); };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen w-full bg-[#020617] text-slate-100 overflow-hidden selection:bg-purple-500 selection:text-white">
      
      {/* --- SKIP LINK --- */}
      <a href="#main-content" className="absolute top-4 left-4 z-50 -translate-y-[150%] bg-purple-600 text-white px-4 py-2 rounded-md font-bold transition-transform focus:translate-y-0 focus:outline-none focus:ring-4 focus:ring-purple-300">
        Skip to main content
      </a>

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse motion-reduce:animate-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] animate-pulse delay-1000 motion-reduce:animate-none"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <main id="main-content" className="relative z-10">
        
        <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center justify-center text-center min-h-[90vh]">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-semibold text-purple-200 mb-8 cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Live Network Activity
          </div>

          {/* H1 Title */}
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="block text-white mb-2">Visualize the</span>
            <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-white bg-clip-text text-transparent drop-shadow-sm">
              SUI Blockchain
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-3xl text-lg md:text-2xl text-slate-300 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            A revolutionary platform bridging the <b>Sui Blockchain</b> with the physical world. 
            Real-time geo-verification, 3D visualization, and next-gen security analysis for every transaction.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link 
              href="/localization"
              className="group relative px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300"
            >
              Launch Map
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-full font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* --- PROJECT DESCRIPTION (ABOUT) --- */}
        <section className="relative py-24 border-t border-white/5 bg-[#020617]/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6">
            <ScrollReveal>
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Bridge Between Chain & Reality</h2>
                    <p className="text-lg text-slate-400 leading-relaxed max-w-4xl mx-auto">
                        This project is an innovative analysis and security platform that visualizes transactions on the Sui blockchain in real-time on a world map. By transferring user location and time data to the smart contract via a secure oracle, it creates a new layer of <b>Geo-Verification</b>.
                    </p>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ScrollReveal delay={100}>
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 hover:border-blue-500/30 transition-all h-full">
                        <FaMapMarkedAlt className="text-4xl text-blue-400 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">Interactive 3D Analysis</h3>
                        <p className="text-slate-400">
                            Every transaction is recorded and displayed dynamically on a 3D globe. Zoom in to reveal country, city, and transaction details, enabling transparent analysis of the geographical distribution and behavior of on-chain movements.
                        </p>
                    </div>
                </ScrollReveal>
                
                <ScrollReveal delay={200}>
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 hover:border-purple-500/30 transition-all h-full">
                        <FaShieldAlt className="text-4xl text-purple-400 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">Geo-Security Standard</h3>
                        <p className="text-slate-400">
                           By adding a geographic verification layer to the blockchain, we introduce a new security paradigm. Location-transaction matching enhances user safety and opens entirely new use cases for the Sui ecosystem.
                        </p>
                    </div>
                </ScrollReveal>
            </div>
          </div>
        </section>

        {/* --- BENEFITS SECTION --- */}
        <section className="relative py-32">
            <div className="max-w-7xl mx-auto px-6">
                <ScrollReveal>
                    <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
                        Unlock New Possibilities
                    </h2>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* 1. USERS */}
                    <ScrollReveal delay={100}>
                        <div className="group relative p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all duration-300 h-full backdrop-blur-md overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all"></div>
                            
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
                                    <FaUserShield size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">For Users</h3>
                                <p className="text-emerald-400 text-sm font-semibold mb-6 uppercase tracking-wider">Security & Control</p>
                                
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <FaCheckCircle className="mt-1 text-emerald-500 shrink-0" />
                                        <span><b>Location-Based Security:</b> Match physical location with tx data to detect stolen devices.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <FaCheckCircle className="mt-1 text-emerald-500 shrink-0" />
                                        <span><b>Live Verification:</b> Verify if a transaction really originated from your location.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <FaCheckCircle className="mt-1 text-emerald-500 shrink-0" />
                                        <span><b>Geo-Fencing:</b> Authorize transactions only from specific regions.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* 2. DEVELOPERS */}
                    <ScrollReveal delay={200}>
                        <div className="group relative p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-300 h-full backdrop-blur-md overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all"></div>
                            
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                                    <FaCode size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">For Developers</h3>
                                <p className="text-blue-400 text-sm font-semibold mb-6 uppercase tracking-wider">Innovation & Infrastructure</p>
                                
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <FaCheckCircle className="mt-1 text-blue-500 shrink-0" />
                                        <span><b>Geo-Smart Contracts:</b> Build Move contracts that utilize location data.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <FaCheckCircle className="mt-1 text-blue-500 shrink-0" />
                                        <span><b>Oracle Infrastructure:</b> Easy integration of location oracles into new dApps.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <FaCheckCircle className="mt-1 text-blue-500 shrink-0" />
                                        <span><b>New dApp Categories:</b> Create Geo-NFTs, location-based games, and mission apps.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* 3. INDUSTRIES */}
                    <ScrollReveal delay={300}>
                        <div className="group relative p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-purple-500/50 hover:bg-slate-900/80 transition-all duration-300 h-full backdrop-blur-md overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-all"></div>
                            
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                                    <FaIndustry size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">For Sectors</h3>
                                <p className="text-purple-400 text-sm font-semibold mb-6 uppercase tracking-wider">Real-World Utility</p>
                                
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <FaCheckCircle className="mt-1 text-purple-500 shrink-0" />
                                        <span><b>Finance & Payments:</b> Enhanced fraud detection with location verification.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <FaCheckCircle className="mt-1 text-purple-500 shrink-0" />
                                        <span><b>Logistics:</b> Immutable geographic tracking for supply chains.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <FaCheckCircle className="mt-1 text-purple-500 shrink-0" />
                                        <span><b>Government:</b> Location-based voting and secure identity verification.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </ScrollReveal>

                </div>
            </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        <section className="py-24 text-center">
            <ScrollReveal>
                <h2 className="text-4xl font-bold text-white mb-8">Ready to explore the network?</h2>
                <Link 
                    href="/localization"
                    className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-purple-500/25"
                >
                    Launch Interactive Map
                    <FaArrowRight />
                </Link>
            </ScrollReveal>
        </section>

      </main>

      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" aria-hidden="true"></div>
    </div>
  );
}