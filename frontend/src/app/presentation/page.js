"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  FaArrowRight, FaArrowLeft, FaGlobeAmericas, FaShieldAlt, 
  FaCode, FaDatabase, FaGamepad, FaBullhorn, FaTruck, FaMapMarkedAlt, 
  FaChartLine, FaLayerGroup, FaCheckCircle, FaRocket
} from "react-icons/fa";

// --- ANİMASYON VARYANTLARI (YENİ) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Elemanlar 0.15sn arayla gelsin
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 }
  }
};

const floatingVariant = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// --- SLAYT İÇERİKLERİ ---
const SLIDES = [
  {
    id: "intro",
    title: "WELCOME",
    component: (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center text-center space-y-8">
        <motion.div 
          variants={itemVariants}
          className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-purple-500 rounded-3xl flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.6)]"
        >
          <FaGlobeAmericas className="text-6xl text-white" />
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-extrabold tracking-tighter text-white">
          SUI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Localization</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-300 max-w-3xl font-light">
          The First <span className="text-white font-semibold">Spatial Data Layer</span> for the Sui Network.
          <br/>
          <span className="text-slate-500 text-lg">Security is just the beginning. We unlock the real-world economy.</span>
        </motion.p>
        <motion.div variants={itemVariants} className="px-5 py-2 border border-white/10 rounded-full text-sm text-slate-400 bg-white/5 backdrop-blur-md animate-pulse">
          Press <span className="bg-slate-700 px-2 py-1 rounded text-white mx-1 border border-slate-600">→</span> to start
        </motion.div>
      </motion.div>
    )
  },
  {
    id: "problem",
    title: "The Problem",
    component: (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-6xl">
        <div className="space-y-6">
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white">
            Digital Assets live in a <span className="text-red-400">Void.</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-slate-300 leading-relaxed">
            Blockchain transactions are powerful but disconnected from physical reality.
            <br/>
            Without <b>Location Data</b>, we are missing context. This "blindness" prevents Web3 from disrupting real-world industries.
          </motion.p>
          <motion.div variants={itemVariants} className="p-6 bg-slate-800/50 border-l-4 border-red-500 rounded-r-xl backdrop-blur-sm">
            <p className="text-lg text-white font-semibold mb-2">Why this matters?</p>
            <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Brands can't target local users.</li>
                <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Games can't use real-world maps.</li>
                <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Compliance is manual and hard.</li>
            </ul>
          </motion.div>
        </div>
        <motion.div variants={itemVariants} className="relative h-64 md:h-80 bg-slate-900/50 rounded-3xl border border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl">
           <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
           <div className="text-center opacity-60">
                <FaMapMarkedAlt className="text-8xl mx-auto mb-4 text-slate-600" />
                <p className="font-mono text-xl text-red-400 animate-pulse">LOCATION DATA: MISSING</p>
           </div>
        </motion.div>
      </motion.div>
    )
  },
  {
    id: "dual-value",
    title: "The Power of Location",
    component: (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center w-full max-w-6xl text-center space-y-12">
        <motion.div variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Two Pillars of Value</h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Our Oracle enables a "Proof of Location" that serves two critical purposes for the Sui ecosystem.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Pillar 1: Security */}
            <motion.div 
                variants={itemVariants} 
                whileHover={{ scale: 1.02 }}
                className="p-8 bg-gradient-to-b from-slate-800 to-slate-900/80 border border-slate-700 hover:border-purple-500/50 rounded-3xl transition-all group text-left relative overflow-hidden shadow-xl"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity rotate-12"><FaShieldAlt size={120} /></div>
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                    <FaShieldAlt className="text-3xl text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">1. The Shield (Security)</h3>
                <p className="text-slate-400 text-lg mb-4">
                    Protect users by verifying transaction origin.
                </p>
                <ul className="text-sm text-slate-500 space-y-2">
                    <li className="flex gap-2">✔ Prevent Stolen Wallet Usage</li>
                    <li className="flex gap-2">✔ Detect Anomalies (Speed of Travel)</li>
                    <li className="flex gap-2">✔ Geo-Fencing for Compliance</li>
                </ul>
            </motion.div>

            {/* Pillar 2: Data/Utility */}
            <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="p-8 bg-gradient-to-b from-slate-800 to-slate-900/80 border border-slate-700 hover:border-cyan-500/50 rounded-3xl transition-all group text-left relative overflow-hidden shadow-xl"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity rotate-12"><FaDatabase size={120} /></div>
                <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
                    <FaChartLine className="text-3xl text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">2. The Engine (Data)</h3>
                <p className="text-slate-400 text-lg mb-4">
                    Unlock new economies with rich spatial data.
                </p>
                <ul className="text-sm text-slate-500 space-y-2">
                    <li className="flex gap-2">✔ Hyper-Local Marketing</li>
                    <li className="flex gap-2">✔ Real-World GameFi Mechanics</li>
                    <li className="flex gap-2">✔ Supply Chain Transparency</li>
                </ul>
            </motion.div>
        </div>
      </motion.div>
    )
  },
  {
    id: "usecases",
    title: "New Economies",
    component: (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-6xl">
            <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Beyond Security: What can we build?
                </h2>
                <p className="text-slate-400">
                    Empowering developers to create location-aware dApps on Sui.
                </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Marketing */}
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                    <div className="h-12 w-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 text-pink-400"><FaBullhorn size={24}/></div>
                    <h3 className="text-xl font-bold text-white mb-2">Smart Marketing</h3>
                    <p className="text-sm text-slate-400">
                        "An intelligent marketing infrastructure that combines real-time geographic blockchain data with regional targeting, campaign optimization, and user insights.."
                    </p>
                </motion.div>
                {/* GameFi */}
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                    <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 text-green-400"><FaGamepad size={24}/></div>
                    <h3 className="text-xl font-bold text-white mb-2">Localization (GameFi)</h3>
                    <p className="text-sm text-slate-400">
                        "Location-based tasks, regional dominance dynamics, and Web3 gaming experiences triggered by physical movement make it possible."
                    </p>
                </motion.div>
                {/* Logistics */}
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                    <div className="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 text-yellow-400"><FaTruck size={24}/></div>
                    <h3 className="text-xl font-bold text-white mb-2">Verified Logistics</h3>
                    <p className="text-sm text-slate-400">
                        “Each transport step's location verification, immutable geotagging, and IoT-enabled Sui integration ensure a fully transparent logistics flow.”
                    </p>
                </motion.div>
            </div>
        </motion.div>
    )
  },
  {
    id: "architecture",
    title: "Technical Flow",
    component: (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl">
            {/* Diagram */}
            <div className="flex-1 flex flex-col gap-6 w-full">
                <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <div>
                        <h4 className="text-white font-bold">User Action</h4>
                        <p className="text-sm text-slate-400">Sign Tx + GPS Coordinates.</p>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="h-8 w-0.5 bg-slate-600 ml-9"></motion.div>
                <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 bg-purple-900/40 rounded-xl border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl"><FaCode /></div>
                    <div>
                        <h4 className="text-white font-bold">Localization Oracle</h4>
                        <p className="text-sm text-slate-300">Verifies IP/GPS integrity & History.</p>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="h-8 w-0.5 bg-slate-600 ml-9"></motion.div>
                <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 bg-emerald-900/40 rounded-xl border border-emerald-500/50">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold"><FaDatabase /></div>
                    <div>
                        <h4 className="text-white font-bold">On-Chain Storage</h4>
                        <p className="text-sm text-slate-300">Verified data available for dApps.</p>
                    </div>
                </motion.div>
            </div>
            
            {/* Visual Code */}
            <motion.div variants={itemVariants} className="flex-1 h-full min-h-[300px] bg-black/60 rounded-xl border border-slate-800 p-6 font-mono text-sm text-green-400 overflow-hidden relative shadow-2xl backdrop-blur-md">
                <div className="absolute top-2 left-4 text-xs text-slate-500">Oracle Log Stream</div>
                <div className="mt-6 space-y-2">
                    <p>&gt; Incoming Tx: 0x8a...42</p>
                    <p>&gt; <span className="text-blue-400">Processing Geolocation...</span></p>
                    <p>&gt; Coordinates: 41.0082, 28.9784</p>
                    <p>&gt; Region: <span className="text-purple-400">Istanbul, TR</span></p>
                    <p className="text-yellow-400">&gt; Status: Verified (Score: 98)</p>
                    <p className="text-white">&gt; <b>Commit to System.</b></p>
                    <motion.p 
                        animate={{ opacity: [0, 1, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.8 }}
                    >_</motion.p>
                </div>
            </motion.div>
        </motion.div>
    )
  },
  {
    id: "demo",
    title: "Live Demo",
    component: (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center text-center space-y-8">
        <motion.h2 variants={itemVariants} className="text-5xl font-bold text-white">Experience the Data</motion.h2>
        <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-2xl">
            We have prepared a live environment showing real-time transaction flows, regional scores, and data clusters.
        </motion.p>
        
        <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <Link 
                href="/localization" 
                target="_blank"
                className="relative flex items-center gap-3 px-8 py-4 bg-black rounded-full leading-none text-white font-bold text-xl hover:bg-slate-900 transition-colors"
            >
                Launch Dashboard <FaArrowRight />
            </Link>
        </motion.div>
        <motion.p variants={itemVariants} className="text-sm text-slate-500 mt-4">(Opens in new tab)</motion.p>
      </motion.div>
    )
  },
  {
    id: "future",
    title: "Roadmap",
    component: (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 opacity-60 hover:opacity-100 transition-opacity">
                <h3 className="text-2xl font-bold text-slate-400 mb-2">Phase 1</h3>
                <p className="text-sm text-slate-500 font-mono mb-4">FOUNDATION</p>
                <ul className="list-disc list-inside text-slate-500 space-y-2 text-sm">
                    <li>3D Globe Launch</li>
                    <li>Basic Oracle Integration</li>
                    <li>Risk Scoring v1</li>
                </ul>
            </motion.div>
            <motion.div 
                variants={itemVariants} 
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-purple-600/10 border border-purple-500 transform shadow-[0_0_30px_rgba(168,85,247,0.15)] relative"
            >
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold tracking-wider">CURRENT</div>
                <h3 className="text-2xl font-bold text-white mb-2">Phase 2</h3>
                <p className="text-sm text-purple-300 font-mono mb-4">DATA LAYER</p>
                <ul className="list-disc list-inside text-slate-200 space-y-2 text-sm">
                    <li>SDK for Developers</li>
                    <li>Spatial Data API</li>
                    <li>Sui Mainnet Pilot</li>
                </ul>
            </motion.div>
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-2xl font-bold text-white mb-2">Phase 3</h3>
                <p className="text-sm text-slate-400 font-mono mb-4">ECOSYSTEM</p>
                <ul className="list-disc list-inside text-slate-400 space-y-2 text-sm">
                    <li>Geo-NFT Standards</li>
                    <li>Data Marketplace</li>
                    <li>Global Governance</li>
                </ul>
            </motion.div>
        </motion.div>
    )
  },
  {
    id: "end",
    component: (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center text-center space-y-6">
        <motion.div variants={floatingVariant} animate="animate">
            <h1 className="text-6xl font-bold text-white mb-4">Thank You!</h1>
        </motion.div>
        <motion.p variants={itemVariants} className="text-xl text-slate-400">
            Sui Localization: Where On-Chain meets On-Ground.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex gap-12 mt-12">
            <div className="text-center group cursor-pointer">
                <div className="w-20 h-20 bg-slate-800 group-hover:bg-slate-700 transition-colors rounded-full mx-auto mb-3 flex items-center justify-center text-3xl shadow-lg border border-slate-600">👨‍💻</div>
                <p className="text-white font-bold">Dev Team</p>
            </div>
            <div className="text-center group cursor-pointer">
                <div className="w-20 h-20 bg-slate-800 group-hover:bg-blue-600/20 transition-colors rounded-full mx-auto mb-3 flex items-center justify-center text-3xl shadow-lg border border-slate-600 group-hover:border-blue-500">🌐</div>
                <p className="text-white font-bold">Sui.io</p>
            </div>
        </motion.div>
      </motion.div>
    )
  }
];

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // 1: next, -1: prev

  // --- KLAVYE KONTROLÜ ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // --- SAYFA GEÇİŞ ANİMASYONLARI ---
  const slideTransitionVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)"
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    }),
  };

  return (
    <div className="relative w-full h-screen bg-[#020617] text-white overflow-hidden flex flex-col font-sans">
      
      {/* --- BACKGROUND EFFECTS (MOVING GRID) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Hareketli Izgara */}
        <motion.div 
            className="absolute inset-0 opacity-20"
            style={{ 
                backgroundImage: 'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }}
            animate={{ 
                backgroundPosition: ["0px 0px", "50px 50px"] 
            }}
            transition={{ 
                repeat: Infinity, 
                duration: 5, 
                ease: "linear" 
            }}
        />
        {/* Sabit Glowlar */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/30 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/30 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* --- PROGRESS BAR --- */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900 z-50">
        <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
            transition={{ duration: 0.6, type: "spring" }}
        />
      </div>

      {/* --- NAVIGATION BUTTONS --- */}
      <div className="absolute bottom-8 right-8 flex gap-4 z-50">
        <button 
            onClick={prevSlide} 
            disabled={currentSlide === 0}
            className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 disabled:opacity-30 transition-all backdrop-blur-md hover:scale-110 active:scale-95"
        >
            <FaArrowLeft />
        </button>
        <button 
            onClick={nextSlide} 
            disabled={currentSlide === SLIDES.length - 1}
            className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 disabled:opacity-30 transition-all backdrop-blur-md hover:scale-110 active:scale-95"
        >
            <FaArrowRight />
        </button>
      </div>

      {/* --- SLIDE COUNTER --- */}
      <div className="absolute bottom-8 left-8 z-50 flex items-center gap-3 text-slate-500 font-mono">
        <span className="text-white font-bold text-lg">{currentSlide + 1}</span>
        <div className="h-px w-8 bg-slate-700"></div>
        <span>{SLIDES.length}</span>
      </div>

      {/* --- MAIN SLIDE CONTENT --- */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-6 md:p-12 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideTransitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full flex flex-col items-center justify-center absolute inset-0 p-12"
          >
            {/* Slide Title (If exists) */}
            {SLIDES[currentSlide].title && (
                <motion.h2 
                    initial={{ opacity: 0, y: -30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-sm font-bold tracking-[0.3em] text-cyan-400 uppercase mb-16 absolute top-12"
                >
                    {SLIDES[currentSlide].title}
                </motion.h2>
            )}

            {/* Slide Component */}
            {SLIDES[currentSlide].component}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}