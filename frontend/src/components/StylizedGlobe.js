"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

// Globe sadece client-side çalışır
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black text-white">
      Loading...
    </div>
  ),
});

// --- VERİLER ---
const REAL_CITIES = [
  { id: 1, name: "Istanbul", region: "Turkey", code: "IST", transactions: 9420, score: 750, lat: 41.0082, lng: 28.9784 },
  { id: 2, name: "New York", region: "USA", code: "NYC", transactions: 15200, score: 680, lat: 40.7128, lng: -74.0060 },
  { id: 3, name: "Tokyo", region: "Japan", code: "TKY", transactions: 12800, score: 890, lat: 35.6762, lng: 139.6503 },
  { id: 4, name: "London", region: "UK", code: "LDN", transactions: 10500, score: 420, lat: 51.5074, lng: -0.1278 },
  { id: 5, name: "Berlin", region: "Germany", code: "BER", transactions: 6300, score: 550, lat: 52.5200, lng: 13.4050 },
  { id: 6, name: "Singapore", region: "Singapore", code: "SIN", transactions: 8900, score: 780, lat: 1.3521, lng: 103.8198 },
  { id: 7, name: "Sydney", region: "Australia", code: "SYD", transactions: 4200, score: 910, lat: -33.8688, lng: 151.2093 },
  { id: 8, name: "Dubai", region: "UAE", code: "DXB", transactions: 11000, score: 600, lat: 25.2048, lng: 55.2708 },
];

export default function StylizedCityGlobe() {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  
  // --- STATE YÖNETİMİ ---
  const [selectedCity, setSelectedCity] = useState(null);       // 1. Pop-up (Şehir)
  const [selectedUser, setSelectedUser] = useState(null);       // 2. Pop-up (Bireysel Kullanıcı Detayı)
  const [selectedCommunity, setSelectedCommunity] = useState(null); // 3. Pop-up (Şirket Detayı)
  
  const [activeTab, setActiveTab] = useState("overview");
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: null });

  // --- MOCK DATA GENERATORS ---

  // Bireysel Kullanıcılar
  const generateUsers = (cityId) => Array.from({ length: 8 }).map((_, i) => ({
    id: `${cityId}-U${i}`,
    name: `User-${Math.floor(Math.random() * 1000)}`,
    address: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
    txCount: Math.floor(Math.random() * 500),
    volume: (Math.random() * 10).toFixed(2),
    status: Math.random() > 0.8 ? "Risky" : "Safe",
    score: Math.floor(Math.random() * 100)
  }));

  // Kullanıcı İşlem Geçmişi
  const generateUserTransactions = (userId) => Array.from({ length: 5 }).map((_, i) => ({
    id: `tx-${i}`,
    hash: `0x${Math.random().toString(16).substr(2, 12)}...`,
    amount: (Math.random() * 5).toFixed(4),
    time: `${Math.floor(Math.random() * 24)}h ago`,
    status: "Success"
  }));

  // Şirketler / Topluluklar
  const generateCommunities = (cityId) => Array.from({ length: 6 }).map((_, i) => ({
    id: `${cityId}-C${i}`,
    name: `Cluster Alpha-${i + 1}`,
    website: "https://example.com",
    description: "A decentralized collective focused on verifying high-value transactions and maintaining network integrity within the region.",
    members: Math.floor(Math.random() * 5000),
    totalVolume: Math.floor(Math.random() * 1000000),
    txCount: Math.floor(Math.random() * 20000)
  }));

  // Şirket Detayı (Hangi şehirde ne kadar işlem yapmış)
  const generateCompanyStats = (companyId) => {
    // Rastgele 3-4 şehir seçip istatistik uyduralım
    const shuffled = [...REAL_CITIES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4).map(city => ({
        cityId: city.id,
        cityName: city.name,
        region: city.region,
        volume: (Math.random() * 50000).toFixed(0),
        txCount: Math.floor(Math.random() * 1200)
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 700) return "#22c55e"; 
    if (score >= 400) return "#eab308"; 
    return "#ef4444"; 
  };

  useEffect(() => {
    setMounted(true);
    fetch("https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  const pauseRotation = () => { if (globeEl.current) globeEl.current.controls().autoRotate = false; };
  
  const resumeRotation = () => { 
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
    }
  };

  const handleHover = (point, event) => {
    if (point) {
        document.body.style.cursor = "pointer";
        pauseRotation();
        setTooltip({ visible: true, x: 0, y: 0, content: point });
    } else {
        document.body.style.cursor = "default";
        if (!selectedCity) resumeRotation();
        setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  const handlePointClick = (point) => {
    if (!point) return;
    setSelectedCity(point);
    setActiveTab("overview");
    setSelectedUser(null);
    setSelectedCommunity(null);
    setTooltip({ visible: false, x: 0, y: 0, content: null });
    pauseRotation();

    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.8 }, 1200);
    }
  };

  const handleClosePopup = () => {
    setSelectedCity(null);
    setSelectedUser(null);
    setSelectedCommunity(null);
    if (globeEl.current) {
      const currentPos = globeEl.current.pointOfView();
      globeEl.current.pointOfView({ ...currentPos, altitude: 2.5 }, 1000);
    }
    setTimeout(resumeRotation, 1000);
  };

  if (!mounted) return null;

  return (
    <div 
        className="w-full h-[calc(100vh-70px)] relative bg-black overflow-hidden font-sans text-white"
        onMouseMove={(e) => {
            if(tooltip.visible) {
                setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
            }
        }}
    >
      
      <Globe
        ref={globeEl}
        backgroundColor="#050505"
        globeMaterial={new THREE.MeshPhongMaterial({ color: "#111827", emissive: "#000000", shininess: 0.7 })}
        showAtmosphere={true}
        atmosphereColor="#38bdf8"
        atmosphereAltitude={0.15}
        onGlobeReady={() => { if (globeEl.current) { globeEl.current.pointOfView({ lat: 25, lng: 35, altitude: 2.5 }); resumeRotation(); }}}
        polygonsData={countries.features}
        polygonCapColor={() => "#1f2937"}
        polygonSideColor={() => "rgba(0,0,0,0)"}
        polygonStrokeColor={() => "#374151"}
        polygonLabel={() => ""}
        labelsData={REAL_CITIES}
        labelLat="lat"
        labelLng="lng"
        labelText={() => "●"} 
        labelSize={2.5} 
        labelColor={() => "rgba(255, 255, 255, 0.01)"} 
        labelResolution={2}
        onLabelClick={handlePointClick}
        onLabelHover={handleHover}
        pointsData={REAL_CITIES}
        pointColor={() => "#ffffff"}
        pointRadius={0.15} 
        pointAltitude={0.04}
        pointLabel={() => ""}
        onPointClick={handlePointClick}
        onPointHover={handleHover}
        ringsData={REAL_CITIES}
        ringAltitude={0.02}
        onRingClick={handlePointClick}
        onRingHover={handleHover}
        ringColor={(d) => (t) => { const hex = getScoreColor(d.score); let r=34,g=197,b=94; if(hex === "#eab308") { r=234;g=179;b=8; } else if(hex === "#ef4444") { r=239;g=68;b=68; } return `rgba(${r},${g},${b},${1 - t})`; }}
        ringMaxRadius={(d) => 2.0 + (d.transactions / 5000)}
        ringPropagationSpeed={1.5}
        ringRepeatPeriod={800}
      />

      {/* --- MODERN TOOLTIP --- */}
      {tooltip.visible && tooltip.content && !selectedCity && (
        <div 
            className="fixed z-50 pointer-events-none bg-slate-900/80 backdrop-blur-md border border-slate-600 px-4 py-2 rounded-lg shadow-xl text-sm"
            style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
        >
            <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getScoreColor(tooltip.content.score) }}></div>
                 <span className="font-semibold text-white tracking-wide">
                    {tooltip.content.region} <span className="text-slate-400 mx-1">/</span> {tooltip.content.name}
                 </span>
            </div>
        </div>
      )}

      {/* --- 1. SEVİYE POP-UP (ANA ŞEHİR PENCERESİ) --- */}
      {selectedCity && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleClosePopup}></div>
          <div className="relative bg-[#0f172a] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: getScoreColor(selectedCity.score) }}></div>
                    <h2 className="text-2xl font-bold tracking-wide text-white">{selectedCity.name}</h2>
                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{selectedCity.code}</span>
                </div>
                <button onClick={handleClosePopup} className="p-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700 bg-slate-800/30 shrink-0">
                <button onClick={() => setActiveTab("overview")} className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "overview" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}>Overview</button>
                <button onClick={() => setActiveTab("analytics")} className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "analytics" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}>Individual</button>
                <button onClick={() => setActiveTab("history")} className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "history" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}>Communities</button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
                
                {/* --- TAB: OVERVIEW --- */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* 3'lü Grid (Region, Volume, Score) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            {/* Region */}
                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center text-center hover:border-blue-500/50 transition-colors group">
                                <div className="p-4 bg-blue-500/10 rounded-full mb-4 group-hover:bg-blue-500/20 transition-colors">
                                    <svg className="text-blue-400 w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <span className="text-slate-400 text-xs uppercase font-bold tracking-widest">Region Location</span>
                                <div className="text-2xl font-bold text-white mt-2">{selectedCity.region}</div>
                            </div>

                            {/* Volume */}
                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center text-center hover:border-purple-500/50 transition-colors group">
                                <div className="p-4 bg-purple-500/10 rounded-full mb-4 group-hover:bg-purple-500/20 transition-colors">
                                    <svg className="text-purple-400 w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                </div>
                                <span className="text-slate-400 text-xs uppercase font-bold tracking-widest">Live Tx Volume</span>
                                <div className="text-2xl font-bold text-white mt-2">{selectedCity.transactions.toLocaleString()}</div>
                            </div>

                            {/* Score (GERİ EKLENDİ) */}
                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center text-center hover:border-green-500/50 transition-colors group">
                                <div className="p-4 bg-green-500/10 rounded-full mb-4 group-hover:bg-green-500/20 transition-colors">
                                    <svg className="text-green-400 w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                </div>
                                <span className="text-slate-400 text-xs uppercase font-bold tracking-widest">Security Score</span>
                                <div className="text-2xl font-bold mt-2" style={{ color: getScoreColor(selectedCity.score) }}>
                                    {selectedCity.score}<span className="text-sm text-slate-500 ml-1">/1000</span>
                                </div>
                            </div>
                        </div>

                        {/* Risk Bar */}
                        <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/50">
                            <div className="flex justify-between items-end mb-3">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-white">Regional Risk Level</span>
                                    <span className="text-xs text-slate-400 mt-1">Status: {selectedCity.score > 700 ? 'Secure' : 'Moderate Risk'}</span>
                                </div>
                                <span className="text-lg font-bold" style={{ color: getScoreColor(selectedCity.score) }}>
                                    %{Math.round((selectedCity.score / 1000) * 100)} Secure
                                </span>
                            </div>
                            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
                                <div className="h-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: `${(selectedCity.score / 1000) * 100}%`, backgroundColor: getScoreColor(selectedCity.score) }}>
                                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] skew-x-12 translate-x-[-150%]"></div>
                                </div>
                            </div>
                            <p className="mt-4 text-[11px] text-slate-500 italic text-center font-medium opacity-70">
                                * Risk level is calculated based on unusual transaction volume intensity, anomaly detections, and historical data breaches in the region.
                            </p>
                        </div>
                    </div>
                )}

                {/* --- TAB: INDIVIDUAL --- */}
                {activeTab === "analytics" && (
                    <div>
                        <p className="text-sm text-slate-400 mb-4">Active individual wallet movements in this region.</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Address</th>
                                        <th className="px-4 py-3">Tx Count</th>
                                        <th className="px-4 py-3">Volume</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {generateUsers(selectedCity.id).map((user) => (
                                        <tr key={user.id} onClick={() => setSelectedUser(user)} className="hover:bg-slate-700/50 cursor-pointer transition-colors group">
                                            <td className="px-4 py-3 font-mono text-xs group-hover:text-blue-400">{user.address}</td>
                                            <td className="px-4 py-3">{user.txCount}</td>
                                            <td className="px-4 py-3">{user.volume}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Risky' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- TAB: COMMUNITIES --- */}
                {activeTab === "history" && (
                    <div>
                        <p className="text-sm text-slate-400 mb-4">Community activities in the region.</p>
                        <div className="grid gap-3">
                            {generateCommunities(selectedCity.id).map((comm) => (
                                <div 
                                    key={comm.id} 
                                    onClick={() => setSelectedCommunity(comm)} // ŞİRKETE TIKLANINCA
                                    className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group"
                                >
                                    <div className="flex flex-col mb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors">{comm.name}</h4>
                                                <div className="flex items-center gap-1 text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20" onClick={(e) => e.stopPropagation()}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                                    <a href={comm.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Website</a>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2 leading-relaxed opacity-80">{comm.description}</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                                        <div className="bg-slate-900/50 p-2 rounded"><div className="text-xs text-slate-500">Members</div><div className="text-sm font-semibold text-slate-200">{comm.members.toLocaleString()}</div></div>
                                        <div className="bg-slate-900/50 p-2 rounded"><div className="text-xs text-slate-500">Tx Count</div><div className="text-sm font-semibold text-slate-200">{comm.txCount.toLocaleString()}</div></div>
                                        <div className="bg-slate-900/50 p-2 rounded"><div className="text-xs text-slate-500">Total Volume</div><div className="text-sm font-semibold text-green-400">${(comm.totalVolume / 1000).toFixed(1)}K</div></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* --- 2. SEVİYE POP-UP (USER DETAILS) --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedUser(null)}></div>
            <div className="relative bg-[#1e293b] border border-blue-500/30 w-full max-w-2xl rounded-xl shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[80vh]">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700 shrink-0 relative">
                    <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">✕</button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center border-2 border-blue-500/50">
                            <span className="text-2xl">👤</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white font-mono tracking-wide">{selectedUser.address}</h3>
                            <div className="flex items-center gap-2 text-sm text-blue-400 mt-1">
                                <span>Verified Wallet</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Hash</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Time</th>
                                    <th className="px-4 py-3 rounded-tr-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {generateUserTransactions(selectedUser.id).map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-blue-300 cursor-pointer hover:underline">{tx.hash}</td>
                                        <td className="px-4 py-3 font-medium text-white">{tx.amount}</td>
                                        <td className="px-4 py-3 text-xs">{tx.time}</td>
                                        <td className="px-4 py-3"><span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">{tx.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- 3. SEVİYE POP-UP (COMPANY DETAILS / CITY STATS) --- */}
      {selectedCommunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedCommunity(null)}></div>
            <div className="relative bg-[#1e293b] border border-blue-500/30 w-full max-w-lg rounded-xl shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
                
                {/* Company Header */}
                <div className="bg-slate-900 p-6 border-b border-slate-700 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{selectedCommunity.name}</h3>
                        <p className="text-xs text-slate-400">Global Operations Breakdown</p>
                    </div>
                    <button onClick={() => setSelectedCommunity(null)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                </div>

                {/* Company Stats Content */}
                <div className="p-6">
                    <p className="text-sm text-slate-400 mb-4">
                        Transaction distribution of <b>{selectedCommunity.name}</b> across different regions:
                    </p>
                    <div className="overflow-hidden rounded-lg border border-slate-700">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">City / Region</th>
                                    <th className="px-4 py-3">Tx Count</th>
                                    <th className="px-4 py-3">Total Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 bg-slate-800/30">
                                {generateCompanyStats(selectedCommunity.id).map((stat) => (
                                    <tr key={stat.cityId} className="hover:bg-slate-700/30">
                                        <td className="px-4 py-3 font-medium text-white">{stat.cityName} <span className="text-slate-500 text-xs ml-1">({stat.region})</span></td>
                                        <td className="px-4 py-3">{stat.txCount}</td>
                                        <td className="px-4 py-3 font-mono text-green-400">${Number(stat.volume).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button 
                        className="w-full mt-6 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded transition-colors text-sm font-semibold"
                        onClick={() => setSelectedCommunity(null)}
                    >
                        Close Report
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}