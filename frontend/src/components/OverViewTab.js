import React from "react";

export default function OverviewTab({
  region,
  transactions,
  score,
  scorePercent,
  scoreStatus,
  getScoreColor,
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Region */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-xs uppercase font-bold tracking-widest">
            Region Location
          </span>
          <div className="text-2xl font-bold text-white mt-2">{region}</div>
        </div>

        {/* Tx Volume */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-xs uppercase font-bold tracking-widest">
            Live Tx Volume
          </span>
          <div className="text-2xl font-bold text-white mt-2">
            {Number(transactions).toLocaleString()}
          </div>
        </div>

        {/* Risky Score */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-xs uppercase font-bold tracking-widest">
            Localization Score
          </span>
          <div
            className="text-2xl font-bold mt-2"
            style={{ color: getScoreColor(score) }}
          >
            {score}
          </div>
        </div>
      </div>

      {/* Risk Bar */}
      <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/50">
        <div className="flex justify-between items-end mb-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              Regional Risk Level
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Status: {scoreStatus}
            </span>
          </div>
          <span
            className="text-lg font-bold"
            style={{ color: getScoreColor(score) }}
          >
            %{scorePercent} Risky
          </span>
        </div>
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
          <div
            className="h-full relative overflow-hidden transition-all duration-1000"
            style={{
              width: `${scorePercent}%`,
              backgroundColor: getScoreColor(score),
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}