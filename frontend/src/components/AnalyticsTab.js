import React, { useEffect } from "react";
import useAnalyticsTabStore from "@/store/AnalyticsTabStore";

// cityUsers prop'u yerine artık cityId alıyoruz.
export default function AnalyticsTab({ cityId, selectUser }) {
  // Store'dan state ve action'ları çekiyoruz
  const { cityUsers, isLoading, error, fetchCitySummary } = useAnalyticsTabStore();

  // cityId değiştiğinde veriyi çek
  useEffect(() => {
    if (cityId) {
      fetchCitySummary(cityId);
    }
  }, [cityId, fetchCitySummary]);

  // Loading durumu (Opsiyonel: Spinner eklenebilir)
  if (isLoading) {
    return (
      <div className="p-4 text-center text-slate-400 text-sm animate-pulse">
        Veriler yükleniyor...
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="p-4 text-center text-red-400 text-sm">
        Hata: {error}
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-2 duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Tx Count</th>
              {/* Backend'de 'score' geliyor, başlığı Score yapabilir veya Volume olarak bırakıp score'u basabilirsin */}
              <th className="px-4 py-3">Score / Volume</th> 
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {cityUsers && cityUsers.length > 0 ? (
              cityUsers.map((user) => {
                // Backend'den gelen JSON anahtarlarına göre eşleştirme:
                // user.tx_count -> txCount
                // user.score -> volume (veya score)
                // user.status -> status
                
                const txCount = user.tx_count ?? user.txCount ?? 0;
                
                // Backend json'ında 'score' var, bunu volume alanında gösteriyoruz
                const volume = user.score ?? user.volume ?? user.volumeUsd ?? 0;
                
                const status = user.status ?? "Unknown";

                return (
                  <tr
                    key={user.id || user.address}
                    onClick={() => selectUser(user)}
                    className="hover:bg-slate-700/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3 font-mono text-xs group-hover:text-blue-400">
                      {user.address}
                    </td>
                    <td className="px-4 py-3">
                      {Number(txCount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {Number(volume).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          String(status).toLowerCase().includes("risk") || 
                          String(status).toLowerCase() === "high" // Ekstra kontrol
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-8 text-center text-slate-500 italic"
                >
                  No active users found in this region.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}