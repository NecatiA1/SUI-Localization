import React, { useEffect } from "react";
import useHistoryTabStore from "@/store/HistoryTabStore";

// cityCommunities prop'u yerine appId alıyoruz (API'deki dinamik kısım)
export default function HistoryTab({ appId, selectCommunity }) {
  // Store'dan verileri ve fonksiyonu çek
  const { cityCommunities, isLoading, error, fetchCityCommunities } = useHistoryTabStore();

  // appId değiştiğinde isteği at
  useEffect(() => {
    if (appId) {
      fetchCityCommunities(appId);
    }
  }, [appId, fetchCityCommunities]);

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
            // comm.members -> members
            // comm.tx_count -> commTxCount
            // comm.score -> totalVolume (Backend score gönderiyor, biz volume olarak gösteriyoruz)
            
            const members =
              comm.members ?? comm.memberCount ?? comm.member_count ?? 0;
            
            const commTxCount = 
              comm.tx_count ?? comm.txCount ?? 0;
            
            // Backend "score" gönderiyor, bunu volume alanında kullanıyoruz
            const totalVolume = 
              comm.score ?? comm.totalVolume ?? comm.total_volume ?? 0;

            return (
              <div
                key={comm.id || comm.name}
                onClick={() => selectCommunity(comm)}
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
                    <div className="text-xs text-slate-500">Volume</div>
                    <div className="text-sm font-semibold text-green-400">
                      {/* Backendden gelen score (Volume) büyük bir sayıysa K formatına çevirir */}
                      ${(Number(totalVolume) / 1000).toFixed(1)}K
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