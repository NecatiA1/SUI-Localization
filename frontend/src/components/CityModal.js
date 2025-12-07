import React, { useState } from "react";
import useGlobalStore from "../store/useGlobalStore";

// Alt bileşenleri import ediyoruz
import OverviewTab from "./OverViewTab";
import AnalyticsTab from "./AnalyticsTab";
import HistoryTab from "./HistoryTab";

// Renk fonksiyonu (Hem modal header hem de OverviewTab kullanıyor)
const getScoreColor = (score) => {
  if (score >= 700) return "#22c55e";
  if (score >= 400) return "#eab308";
  return "#ef4444";
};

export default function CityModal() {
  const {
    selectedCity,
    cityUsers,
    cityCommunities,
    isLoading,
    closeCityModal,
    selectUser,
    selectCommunity,
  } = useGlobalStore();

  const [activeTab, setActiveTab] = useState("overview");

  if (!selectedCity) return null;

  // --- Veri Normalizasyonu ve Hazırlık ---
  const region =
    selectedCity.region ||
    selectedCity.country ||
    selectedCity.region_name ||
    "-";

  const transactions =
    selectedCity.transactions ??
    selectedCity.txCount ??
    selectedCity.tx_count ??
    0;

  const score =
    selectedCity.score ??
    selectedCity.riskScore ??
    selectedCity.risk_score ??
    500;

  const scorePercent = Math.round((score / 1000) * 100);
  const scoreStatus =
    score >= 700 ? "Secure" : score >= 400 ? "Moderate Risk" : "High Risk";

  const cityCode =
    selectedCity.code ||
    selectedCity.city_code ||
    selectedCity.id ||
    selectedCity.city_id;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Arka plan karartması */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCityModal}
      ></div>

      {/* Modal penceresi */}
      <div className="relative bg-[#0f172a] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: getScoreColor(score) }}
            ></div>
            <h2 className="text-2xl font-bold tracking-wide text-white">
              {selectedCity.name}
            </h2>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {cityCode}
            </span>
          </div>
          <button
            onClick={closeCityModal}
            className="p-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex border-b border-slate-700 bg-slate-800/30 shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "analytics"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "history"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Communities
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 overflow-y-auto custom-scrollbar min-h-[300px]">
          {isLoading && activeTab !== "overview" ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-10">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-sm text-slate-400 animate-pulse">
                Fetching regional blockchain data...
              </p>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewTab
                  region={region}
                  transactions={transactions}
                  score={score}
                  scorePercent={scorePercent}
                  scoreStatus={scoreStatus}
                  getScoreColor={getScoreColor}
                />
              )}

              {activeTab === "analytics" && (
                <AnalyticsTab 
                  cityUsers={cityUsers} 
                  selectUser={selectUser} 
                />
              )}

              {activeTab === "history" && (
                <HistoryTab
                  cityCommunities={cityCommunities}
                  selectCommunity={selectCommunity}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}