import React from "react";
import useGlobalStore from "@/store/useGlobalStore";

export default function CommunityModal() {
  const { selectedCommunity, communityStats, closeCommunityModal } = useGlobalStore();

  if (!selectedCommunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeCommunityModal}></div>
      <div className="relative bg-[#1e293b] border border-blue-500/30 w-full max-w-lg rounded-xl shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
        
        <div className="bg-slate-900 p-6 border-b border-slate-700 flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold text-white mb-1">{selectedCommunity.name}</h3>
                <p className="text-xs text-slate-400">Global Operations Breakdown</p>
            </div>
            <button onClick={closeCommunityModal} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>

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
                        {/* Store'dan gelen communityStats kullanılıyor */}
                        {communityStats.map((stat) => (
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
                onClick={closeCommunityModal}
            >
                Close Report
            </button>
        </div>
      </div>
    </div>
  );
}