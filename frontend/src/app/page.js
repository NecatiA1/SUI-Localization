"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion"; // Framer Motion eklendi
import { 
  FaArrowRight, FaGlobeAmericas, FaShieldAlt, FaNetworkWired, 
  FaUserShield, FaCode, FaIndustry, FaMapMarkedAlt, FaCheckCircle, FaRocket 
} from "react-icons/fa";

// --- ANIMATION VARIANTS (Animasyon Ayarları) ---
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } // Yumuşak "Apple-style" geçiş
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Çocuk elemanlar 0.2sn arayla gelsin
      delayChildren: 0.1
    }
  }
};

const codeTyping = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.05, staggerChildren: 0.03 } // Harf harf yazma efekti için
  }
};

export default function WelcomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse Takibi
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#020617] text-slate-100 overflow-hidden selection:bg-purple-500 selection:text-white">
      
      {/* Skip Link */}
      <a href="#main-content" className="absolute top-4 left-4 z-50 -translate-y-[150%] bg-purple-600 text-white px-4 py-2 rounded-md font-bold transition-transform focus:translate-y-0 focus:outline-none focus:ring-4 focus:ring-purple-300">
        Skip to main content
      </a>

      {/* --- BACKGROUND SPOTLIGHT --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        {/* Mouse Spotlight */}
        <motion.div 
            className="absolute inset-0"
            animate={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.15), transparent 80%)`
            }}
            transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[128px]"></div>
      </div>

      <main id="main-content" className="relative z-10">
        
        {/* --- HERO SECTION --- */}
        <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center justify-center text-center min-h-[90vh]">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-semibold text-purple-200 mb-8 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Live Network Activity
            </motion.div>

            {/* Title */}
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8">
              <span className="block text-white mb-2">Visualize the</span>
              <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-white bg-clip-text text-transparent drop-shadow-sm">
                SUI Blockchain
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={fadeInUp} className="max-w-3xl text-lg md:text-2xl text-slate-300 mb-12 leading-relaxed">
              A revolutionary platform bridging the <b>Sui Blockchain</b> with the physical world. 
              Real-time geo-verification, 3D visualization, and next-gen security analysis for every transaction.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-20">
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
            </motion.div>
          </motion.div>
        </section>

        {/* --- PROJECT DESCRIPTION (ABOUT) --- */}
        <section className="relative py-24 border-t border-white/5 bg-[#020617]/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Bridge Between Chain & Reality</h2>
                <p className="text-lg text-slate-400 leading-relaxed max-w-4xl mx-auto">
                    This project is an innovative analysis and security platform that visualizes transactions on the Sui blockchain in real-time on a world map. By transferring user location and time data to the smart contract via a secure oracle, it creates a new layer of <b>Geo-Verification</b>.
                </p>
            </motion.div>

            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                <motion.div variants={fadeInUp} className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 hover:border-blue-500/30 transition-all h-full group hover:-translate-y-2 duration-500">
                    <FaMapMarkedAlt className="text-4xl text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold text-white mb-4">Interactive 3D Analysis</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Every transaction is recorded and displayed dynamically on a 3D globe. Zoom in to reveal country, city, and transaction details, enabling transparent analysis of the geographical distribution and behavior of on-chain movements.
                    </p>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 hover:border-purple-500/30 transition-all h-full group hover:-translate-y-2 duration-500">
                    <FaShieldAlt className="text-4xl text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold text-white mb-4">Geo-Security Standard</h3>
                    <p className="text-slate-400 leading-relaxed">
                       By adding a geographic verification layer to the blockchain, we introduce a new security paradigm. Location-transaction matching enhances user safety and opens entirely new use cases for the Sui ecosystem.
                    </p>
                </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- DEVELOPER / CODE SECTION --- */}
        <section className="py-32 relative overflow-hidden border-t border-white/5 bg-[#020617]/30">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] -z-10"></div>
             
             <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Left Text */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="flex items-center gap-2 text-blue-400 font-bold mb-4 uppercase tracking-widest text-sm">
                        <FaCode /> Developers First
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6">Built for SUI Builders</motion.h2>
                    <motion.p variants={fadeInUp} className="text-lg text-slate-400 mb-8 leading-relaxed">
                        Integrate geo-location data directly into your Move smart contracts using our lightweight Oracle SDK. Enable location-based NFT drops, gaming zones, and compliance checks with just a few lines of code.
                    </motion.p>
                    <motion.ul variants={staggerContainer} className="space-y-4 mb-8">
                        {["Easy-to-use Move SDK", "Sub-second Latency Oracle", "Real-time WebSocket Feed"].map((item, i) => (
                            <motion.li key={i} variants={fadeInUp} className="flex items-center gap-3 text-slate-300">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs"><FaCheckCircle /></div>
                                {item}
                            </motion.li>
                        ))}
                    </motion.ul>
                    <motion.div variants={fadeInUp}>
                        <Link href="/" className="text-white border-b border-blue-500 pb-1 hover:text-blue-400 transition-colors">View API Documentation &rarr;</Link>
                    </motion.div>
                </motion.div>

                {/* Right Mock Terminal (Canlı Yazma Efekti ile) */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="rounded-xl overflow-hidden bg-[#0d1117] border border-slate-700 shadow-2xl font-mono text-sm relative group"
                >
                    <div className="bg-slate-800/50 px-4 py-3 flex gap-2 border-b border-slate-700">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="ml-auto text-xs text-slate-500">move_contract.move</div>
                    </div>
                    
                    <div className="p-6 text-slate-300 leading-relaxed overflow-x-auto">
                        {/* Static highlighting for stability, simple fade in for lines */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                            <motion.p variants={fadeInUp}><span className="text-purple-400">module</span> <span className="text-yellow-200">SuiGeo::LocationVerifier</span> &#123;</motion.p>
                            <motion.p variants={fadeInUp} className="pl-4"><span className="text-purple-400">use</span> <span className="text-blue-300">Sui::Object</span>::&#123;UID&#125;;</motion.p>
                            <motion.p variants={fadeInUp} className="pl-4"><span className="text-purple-400">use</span> <span className="text-blue-300">Oracle::GeoFeed</span>;</motion.p>
                            <br/>
                            <motion.p variants={fadeInUp} className="pl-4"><span className="text-purple-400">public entry fun</span> <span className="text-yellow-200">verify_tx</span>(ctx: &<span className="text-purple-400">mut</span> TxContext) &#123;</motion.p>
                            <motion.p variants={fadeInUp} className="pl-8 text-slate-500">// Fetch user coordinates</motion.p>
                            <motion.p variants={fadeInUp} className="pl-8"><span className="text-purple-400">let</span> location = <span className="text-blue-300">GeoFeed</span>::get_current_pos(ctx);</motion.p>
                            <br/>
                            <motion.p variants={fadeInUp} className="pl-8"><span className="text-purple-400">if</span> (location.country == <span className="text-green-300">b"TR"</span>) &#123;</motion.p>
                            <motion.p variants={fadeInUp} className="pl-12 text-slate-500">// Authorize transaction logic...</motion.p>
                            <motion.p variants={fadeInUp} className="pl-8">&#125;</motion.p>
                            <motion.p variants={fadeInUp} className="pl-4">&#125;</motion.p>
                            <motion.p variants={fadeInUp}>&#125;</motion.p>
                        </motion.div>
                    </div>
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </motion.div>
             </div>
        </section>

        {/* --- BENEFITS SECTION --- */}
        <section className="relative py-32 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
                        Unlock New Possibilities
                    </h2>
                </motion.div>

                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {/* User Card */}
                    <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-slate-900/40 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all duration-500 h-full backdrop-blur-md">
                        <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
                            <FaUserShield size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">For Users</h3>
                        <p className="text-emerald-400 text-sm font-semibold mb-6 uppercase tracking-wider">Security & Control</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-300"><FaCheckCircle className="mt-1 text-emerald-500 shrink-0" /><span><b>Location-Based Security:</b> Match physical location with tx data.</span></li>
                            <li className="flex items-start gap-3 text-slate-300"><FaCheckCircle className="mt-1 text-emerald-500 shrink-0" /><span><b>Live Verification:</b> Verify transaction origin.</span></li>
                            <li className="flex items-start gap-3 text-slate-300"><FaCheckCircle className="mt-1 text-emerald-500 shrink-0" /><span><b>Geo-Fencing:</b> Regional authorization.</span></li>
                        </ul>
                    </motion.div>

                    {/* Developer Card */}
                    <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-slate-900/40 border border-white/10 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all duration-500 h-full backdrop-blur-md">
                        <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                            <FaCode size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">For Developers</h3>
                        <p className="text-blue-400 text-sm font-semibold mb-6 uppercase tracking-wider">Infrastructure</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-300"><FaCheckCircle className="mt-1 text-blue-500 shrink-0" /><span><b>Geo-Smart Contracts:</b> Location-aware Move contracts.</span></li>
                            <li className="flex items-start gap-3 text-slate-300"><FaCheckCircle className="mt-1 text-blue-500 shrink-0" /><span><b>Oracle Infrastructure:</b> Easy integration.</span></li>
                            <li className="flex items-start gap-3 text-slate-300"><FaCheckCircle className="mt-1 text-blue-500 shrink-0" /><span><b>New dApp Categories:</b> Geo-NFTs & games.</span></li>
                        </ul>
                    </motion.div>

                    {/* Sector Card */}
                    <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-slate-900/40 border border-white/10 hover:border-purple-500/50 hover:bg-slate-900/60 transition-all duration-500 h-full backdrop-blur-md">
                        <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                            <FaIndustry size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">For Sectors</h3>
                        <p className="text-purple-400 text-sm font-semibold mb-6 uppercase tracking-wider">Real-World Utility</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-300"><FaCheckCircle className="mt-1 text-purple-500 shrink-0" /><span><b>Finance & Payments:</b> Fraud detection.</span></li>
                            <li className="flex items-start gap-3 text-slate-300"><FaCheckCircle className="mt-1 text-purple-500 shrink-0" /><span><b>Logistics:</b> Immutable tracking.</span></li>
                            <li className="flex items-start gap-3 text-slate-300"><FaCheckCircle className="mt-1 text-purple-500 shrink-0" /><span><b>Government:</b> Secure voting & ID.</span></li>
                        </ul>
                    </motion.div>
                </motion.div>
            </div>
        </section>

        {/* --- ROADMAP SECTION --- */}
        <section className="py-32 relative">
             <div className="max-w-5xl mx-auto px-6">
                 <motion.h2 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-white text-center mb-16"
                 >
                    Roadmap
                 </motion.h2>

                 <div className="relative">
                    {/* Dikey Çizgi Animasyonu */}
                    <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute left-8 md:left-1/2 top-0 w-px bg-gradient-to-b from-purple-500/0 via-purple-500 to-purple-500/0 -translate-x-1/2"
                    ></motion.div>

                    {/* Phase 1 */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative flex flex-col md:flex-row items-center justify-between mb-16"
                    >
                        <div className="md:w-5/12 text-left md:text-right mb-4 md:mb-0 pl-16 md:pl-0 md:pr-12 order-1 md:order-1">
                            <h3 className="text-xl font-bold text-purple-400">Phase 1: Foundation</h3>
                            <p className="text-slate-400 mt-2">Interactive 3D Globe launch, basic transaction tracking, and mainnet integration.</p>
                        </div>
                        <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-purple-600 border-4 border-[#020617] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(147,51,234,0.5)]">
                            <FaRocket className="text-white text-xs" />
                        </div>
                        <div className="md:w-5/12 pl-16 md:pl-12 order-1 md:order-1 opacity-50 md:opacity-100">
                            <span className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded">Q1 2024</span>
                        </div>
                    </motion.div>

                    {/* Phase 2 */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex flex-col md:flex-row items-center justify-between mb-16"
                    >
                        <div className="md:w-5/12 text-left md:text-right mb-4 md:mb-0 pl-16 md:pl-0 md:pr-12 order-1 md:order-1 md:text-slate-500 opacity-50 md:opacity-100">
                            <span className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded">Q3 2024</span>
                        </div>
                        <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-700 border-2 border-[#020617] z-10"></div>
                        <div className="md:w-5/12 pl-16 md:pl-12 order-1 md:order-1">
                            <h3 className="text-xl font-bold text-white">Phase 2: Oracle Beta</h3>
                            <p className="text-slate-400 mt-2">Release of the Geo-Oracle SDK for developers and integration with pilot dApps.</p>
                        </div>
                    </motion.div>

                    {/* Phase 3 */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative flex flex-col md:flex-row items-center justify-between"
                    >
                        <div className="md:w-5/12 text-left md:text-right mb-4 md:mb-0 pl-16 md:pl-0 md:pr-12 order-1 md:order-1">
                            <h3 className="text-xl font-bold text-white">Phase 3: Ecosystem</h3>
                            <p className="text-slate-400 mt-2">Full governance DAO launch, Heatmap analytics mode, and global partnership expansion.</p>
                        </div>
                        <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-700 border-2 border-[#020617] z-10"></div>
                        <div className="md:w-5/12 pl-16 md:pl-12 order-1 md:order-1 opacity-50 md:opacity-100">
                            <span className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded">2025+</span>
                        </div>
                    </motion.div>
                 </div>
             </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="py-24 text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl font-bold text-white mb-8">Ready to explore the network?</h2>
                <Link 
                    href="/localization"
                    className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-purple-500/25"
                >
                    Launch Interactive Map
                    <FaArrowRight />
                </Link>
            </motion.div>
        </section>

      </main>

      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" aria-hidden="true"></div>
    </div>
  );
}