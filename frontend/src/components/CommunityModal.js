import React from "react";
import useCommunityModalStore from "@/store/CommunityModalStore";

export default function CommunityModal() {
  const {
    selectedCommunity,
    communityStats,
    isCommunityLoading,
    communityError,
    closeCommunityModal,
  } = useCommunityModalStore();

  if (!selectedCommunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Arka plan blur + karartma */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={closeCommunityModal}
      ></div>

      <div className="relative bg-[#1e293b] border border-blue-500/30 w-full max-w-lg rounded-xl shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-slate-900 p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {selectedCommunity.name}
            </h3>
            <p className="text-xs text-slate-400">
              Global Operations Breakdown
            </p>
          </div>
          <button
            onClick={closeCommunityModal}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Hata mesajı */}
          {communityError && (
            <div className="mb-4 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {communityError}
            </div>
          )}

          {/* Loading durumu */}
          {isCommunityLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-400 animate-pulse">
                Fetching city distribution for {selectedCommunity.name}...
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-400 mb-4">
                Transaction distribution of{" "}
                <b>{selectedCommunity.name}</b> across different regions:
              </p>

              <div className="dark-scroll overflow-hidden rounded-lg border max-h-[500px] overflow-y-auto border-slate-700">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-3">City / Region</th>
                      <th className="px-4 py-3">Tx Count</th>
                      <th className="px-4 py-3">Total Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700 bg-slate-800/30">
                    {communityStats && communityStats.length > 0 ? (
                      communityStats.map((stat) => {
                        console.log("Community Stat:", stat);
                        const cityName = stat.cityName || stat.name;
                        const region = stat.region || "";
                        const txCount =
                          stat.txCount ?? stat.tx_count ?? 0;
                        const volume = stat.score ?? 5; // store'da volume yoksa score'u kullan

                        return (
                          <tr
                            key={stat.cityId || stat.id || cityName}
                            className="hover:bg-slate-700/30"
                          >
                            <td className="px-4 py-3 font-medium text-white">
                              {cityName}{" "}
                              {region && (
                                <span className="text-slate-500 text-xs ml-1">
                                  ({region})
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {Number(txCount).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono text-green-400">
                              {Number(volume).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-slate-500 italic"
                        >
                          No city data found for this community.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <button
                className="w-full mt-6 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded transition-colors text-sm font-semibold"
                onClick={closeCommunityModal}
              >
                Close Report
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}