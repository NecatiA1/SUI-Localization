import React, { useState } from "react";
import useGlobalStore from "../store/useGlobalStore";

// Renk fonksiyonunu buraya da koyuyoruz (İleride utils dosyasına taşınabilir)
const getScoreColor = (score) => {
  if (score >= 700) return "#22c55e"; 
  if (score >= 400) return "#eab308"; 
  return "#ef4444"; 
};

export default function CityModal() {
  // 1. EKSİK GİDERİLDİ: isLoading state'ini store'dan çektik.
  const { 
    selectedCity, 
    cityUsers, 
    cityCommunities, 
    isLoading, // Veriler yükleniyor mu?
    closeCityModal, 
    selectUser, 
    selectCommunity 
  } = useGlobalStore();
  
  const [activeTab, setActiveTab] = useState("overview");

  // Eğer şehir seçili değilse hiç render etme
  if (!selectedCity) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Arka plan karartması */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeCityModal}></div>
      
      {/* Modal Penceresi */}
      <div className="relative bg-[#0f172a] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* --- HEADER --- */}
        {/* Header verisi senkron (anlık) geldiği için loading'e gerek yok */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900/50">
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: getScoreColor(selectedCity.score) }}></div>
                <h2 className="text-2xl font-bold tracking-wide text-white">{selectedCity.name}</h2>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{selectedCity.code}</span>
            </div>
            <button onClick={closeCityModal} className="p-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">✕</button>
        </div>

        {/* --- TABS --- */}
        <div className="flex border-b border-slate-700 bg-slate-800/30 shrink-0">
            <button onClick={() => setActiveTab("overview")} className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "overview" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}>Overview</button>
            <button onClick={() => setActiveTab("analytics")} className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "analytics" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}>Individual</button>
            <button onClick={() => setActiveTab("history")} className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "history" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}>Communities</button>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="p-6 overflow-y-auto custom-scrollbar min-h-[300px]">
            
            {/* 2. EKSİK GİDERİLDİ: Loading Durumu Kontrolü */}
            {/* Eğer veri yükleniyorsa ve Overview sekmesinde değilsek (Overview verisi hazır çünkü) Loading Spinner göster */}
            {isLoading && activeTab !== "overview" ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 py-10">
                    <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-400 animate-pulse">Fetching regional blockchain data...</p>
                </div>
            ) : (
                <>
                    {/* --- TAB: OVERVIEW --- */}
                    {activeTab === "overview" && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                                    <span className="text-slate-400 text-xs uppercase font-bold tracking-widest">Region Location</span>
                                    <div className="text-2xl font-bold text-white mt-2">{selectedCity.region}</div>
                                </div>
                                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                                    <span className="text-slate-400 text-xs uppercase font-bold tracking-widest">Live Tx Volume</span>
                                    <div className="text-2xl font-bold text-white mt-2">{selectedCity.transactions.toLocaleString()}</div>
                                </div>
                                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center text-center">
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
                                    <div className="h-full relative overflow-hidden transition-all duration-1000" style={{ width: `${(selectedCity.score / 1000) * 100}%`, backgroundColor: getScoreColor(selectedCity.score) }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: INDIVIDUAL (USERS) --- */}
                    {activeTab === "analytics" && (
                        <div className="animate-in slide-in-from-bottom-2 duration-300">
                            <p className="text-sm text-slate-400 mb-4">Active individual wallet movements in this region.</p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                                        <tr>
                                            <th className="px-4 py-3">Address</th>
                                            <th className="px-4 py-3">Tx Count</th>
                                            <th className="px-4 py-3">Volume</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {cityUsers && cityUsers.length > 0 ? (
                                            cityUsers.map((user) => (
                                                <tr key={user.id} onClick={() => selectUser(user)} className="hover:bg-slate-700/50 cursor-pointer transition-colors group">
                                                    <td className="px-4 py-3 font-mono text-xs group-hover:text-blue-400">{user.address}</td>
                                                    <td className="px-4 py-3">{user.txCount}</td>
                                                    <td className="px-4 py-3">{user.volume}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Risky' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-8 text-center text-slate-500 italic">No active users found in this region.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: COMMUNITIES --- */}
                    {activeTab === "history" && (
                        <div className="animate-in slide-in-from-bottom-2 duration-300">
                            <p className="text-sm text-slate-400 mb-4">Community activities in the region.</p>
                            <div className="grid gap-3">
                                {cityCommunities && cityCommunities.length > 0 ? (
                                    cityCommunities.map((comm) => (
                                        <div 
                                            key={comm.id} 
                                            onClick={() => selectCommunity(comm)} 
                                            className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group"
                                        >
                                            <div className="flex flex-col mb-2">
                                                <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors">{comm.name}</h4>
                                                <p className="text-xs text-slate-400 mt-2 leading-relaxed opacity-80">{comm.description}</p>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                                                <div className="bg-slate-900/50 p-2 rounded"><div className="text-xs text-slate-500">Members</div><div className="text-sm font-semibold text-slate-200">{comm.members.toLocaleString()}</div></div>
                                                <div className="bg-slate-900/50 p-2 rounded"><div className="text-xs text-slate-500">Tx Count</div><div className="text-sm font-semibold text-slate-200">{comm.txCount.toLocaleString()}</div></div>
                                                <div className="bg-slate-900/50 p-2 rounded"><div className="text-xs text-slate-500">Volume</div><div className="text-sm font-semibold text-green-400">${(comm.totalVolume / 1000).toFixed(1)}K</div></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-slate-500 py-8 italic">No active communities found.</div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
      </div>
    </div>
  );
}