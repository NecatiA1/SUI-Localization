import React, { useEffect } from "react";
import useHistoryTabStore from "@/store/HistoryTabStore";

// ⛔ appId değil
// ✅ cityId alıyoruz (seçili şehrin id'si)
export default function HistoryTab({ cityId, selectCommunity }) {
  const {
    cityCommunities,
    isLoading,
    error,
    fetchCityCommunities,
  } = useHistoryTabStore();

  // cityId değiştiğinde o şehrin communities datasını çek
  useEffect(() => {
    if (cityId) {
      fetchCityCommunities(cityId);
    }
  }, [cityId, fetchCityCommunities]);

  // Loading Durumu
  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse text-sm">
        Topluluk verileri yükleniyor...
      </div>
    );
  }

  // Hata Durumu
  if (error) {
    return (
      <div className="p-8 text-center text-red-400 text-sm">
        Bir hata oluştu: {error}
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-2 duration-300">
      <div className="grid gap-3">
        {cityCommunities && cityCommunities.length > 0 ? (
          cityCommunities.map((comm) => {
            // Backend verilerini UI ile eşleştirme:
            // members       → comm.members
            // tx_count      → comm.tx_count
            // score         → totalVolume (Volume olarak gösteriyoruz)

            const members =
              comm.members ?? comm.memberCount ?? comm.member_count ?? 0;

            const commTxCount = comm.tx_count ?? comm.txCount ?? 0;

            const totalVolume = comm.total_score ?? 0;

            return (
              <div
                key={comm.id || comm.name}
                onClick={() => selectCommunity?.(comm)}
                className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group"
              >
                <div className="flex flex-col mb-2">
                  <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors">
                    {comm.name}
                  </h4>
                  {comm.description && (
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed opacity-80">
                      {comm.description}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="bg-slate-900/50 p-2 rounded">
                    <div className="text-xs text-slate-500">Members</div>
                    <div className="text-sm font-semibold text-slate-200">
                      {Number(members).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded">
                    <div className="text-xs text-slate-500">Tx Count</div>
                    <div className="text-sm font-semibold text-slate-200">
                      {Number(commTxCount).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded">
                    <div className="text-xs text-slate-500">Score</div>
                    <div className="text-sm font-semibold text-green-400">
                      {/* Score büyük sayıysa daha okunur olsun diye K formatı */}
                      {(Number(totalVolume) / 1000).toFixed(1)}K
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-slate-500 py-8 italic">
            No active communities found.
          </div>
        )}
      </div>
    </div>
  );
}
