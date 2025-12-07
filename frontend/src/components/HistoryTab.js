import React, { useEffect, useState } from "react";
import useHistoryTabStore from "@/store/HistoryTabStore";
import { FiCopy, FiCheck, FiGlobe } from "react-icons/fi"; // İkonları ekledik

export default function HistoryTab({ cityId, selectCommunity }) {
  const {
    cityCommunities,
    isLoading,
    error,
    fetchCityCommunities,
  } = useHistoryTabStore();

  useEffect(() => {
    if (cityId) {
      fetchCityCommunities(cityId);
    }
  }, [cityId, fetchCityCommunities]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse text-sm">
        Topluluk verileri yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-400 text-sm">
        Bir hata oluştu: {error}
      </div>
    );
  }

  // Sort communities by score in descending order (highest score first)
  const sortedCommunities = cityCommunities && cityCommunities.length > 0
    ? [...cityCommunities].sort((a, b) => {
        const scoreA = a.total_score ?? 0;
        const scoreB = b.total_score ?? 0;
        return scoreB - scoreA; // Descending order (highest first)
      })
    : [];

  return (
    <div className="animate-in slide-in-from-bottom-2 duration-300">
      <div className="grid gap-3">
        {sortedCommunities && sortedCommunities.length > 0 ? (
          sortedCommunities.map((comm) => (
            <CommunityCard 
              key={comm.id || comm.name} 
              comm={comm} 
              selectCommunity={selectCommunity} 
            />
          ))
        ) : (
          <div className="text-center text-slate-500 py-8 italic">
            No active communities found.
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Alt Bileşen: CommunityCard
// Kopyalama durumu (state) her kartın kendi içinde yönetilsin diye ayırdık.
// ------------------------------------------------------------------
function CommunityCard({ comm, selectCommunity }) {
  const [isCopied, setIsCopied] = useState(false);

  const members = comm.members ?? comm.memberCount ?? comm.member_count ?? 0;
  const commTxCount = comm.tx_count ?? comm.txCount ?? 0;
  const totalVolume = comm.total_score ?? 0;

  // Domain kopyalama fonksiyonu
  const handleCopy = (e, text) => {
    e.stopPropagation(); // Kartın tıklanma olayını (selectCommunity) engelle
    if (!text) return;
    
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      onClick={() => selectCommunity?.(comm)}
      className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group relative overflow-hidden shadow-md hover:shadow-lg hover:shadow-blue-500/10"
    >
      {/* Sol Kenar Çizgisi Efekti */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/80 transition-all duration-500" />

      <div className="flex flex-col mb-3">
        {/* Üst Kısım: İsim ve Domain Yapısı */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          {/* Proje İsmi */}
          <h4 className="text-white font-bold text-lg tracking-tight group-hover:text-blue-400 transition-colors">
            {comm.name}
          </h4>

          {/* Modern Domain Badge Tasarımı */}
          {comm.web_address && (
            <div 
              className="flex items-center gap-2 bg-slate-900/60 rounded-full pl-3 pr-1 py-1 border border-slate-700/50 w-fit max-w-full"
              onClick={(e) => e.stopPropagation()} // Badge'e tıklayınca da seçim yapmasın
            >
              <FiGlobe className="text-slate-500 text-xs shrink-0" />
              
              <span className="text-xs font-mono text-slate-300 truncate max-w-[150px]">
                {comm.web_address.replace(/^https?:\/\//, '')} {/* https kısmını görselde gizle */}
              </span>

              {/* Kopyala Butonu */}
              <button
                onClick={(e) => handleCopy(e, comm.web_address)}
                className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
                  isCopied 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "hover:bg-slate-700 text-slate-500 hover:text-white"
                }`}
                title="Adresi Kopyala"
              >
                {isCopied ? <FiCheck size={12} /> : <FiCopy size={12} />}
              </button>
            </div>
          )}
        </div>

        {/* Açıklama */}
        {comm.description && (
          <p className="text-xs text-slate-400 mt-2 leading-relaxed opacity-80 line-clamp-2">
            {comm.description}
          </p>
        )}
      </div>

      {/* İstatistik Grid'i */}
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <StatBox label="Members" value={Number(members).toLocaleString()} />
        <StatBox label="Tx Count" value={Number(commTxCount).toLocaleString()} />
        <StatBox 
          label="Score" 
          value={(Number(totalVolume) / 1000).toFixed(1) + "K"} 
          valueColor="text-emerald-400" 
        />
      </div>
    </div>
  );
}

// Ufak bir StatBox bileşeni (Kod tekrarını önlemek için)
function StatBox({ label, value, valueColor = "text-slate-200" }) {
  return (
    <div className="bg-slate-900/40 p-2 rounded border border-slate-800/50">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">{label}</div>
      <div className={`text-sm font-semibold ${valueColor}`}>
        {value}
      </div>
    </div>
  );
}