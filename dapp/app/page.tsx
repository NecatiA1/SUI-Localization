"use client";

import { useState } from "react";
import { localizationClient } from "@/lib/localizationClient";

type StartResponse = {
  geoTxId: number;
  createdAt: string;
  city: {
    id: number;
    name: string;
    countryCode: string;
  };
};

type ConfirmResponse = {
  geoTxId: number;
  status: string;
  txScore: string;
  confirmedAt: string;
};

export default function DemoPage() {
  const [userAddress, setUserAddress] = useState("SUI-USER-DEMO-1");
  const [cityName, setCityName] = useState("Istanbul");
  const [countryCode, setCountryCode] = useState("TR");
  const [amountSui, setAmountSui] = useState("10");

  const [geoTxId, setGeoTxId] = useState<number | null>(null);
  const [startResult, setStartResult] = useState<StartResponse | null>(null);
  const [confirmResult, setConfirmResult] = useState<ConfirmResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    try {
      setError(null);
      setLoading(true);
      setConfirmResult(null);

      const res = await localizationClient.startWithLocation({
        userAddress,
        meta: {
          demo: true,
          note: "Hackathon demo",
        },
      });

      setStartResult(res);
      setGeoTxId(res.geoTxId);
    } catch (err: any) {
      console.error("startWithLocation error", err);
      setError(err?.message || "Start failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!geoTxId) {
      setError("Önce start yapmalısın.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Hackathon demosu için txDigest'i uyduruyoruz.
      // Gerçek dapp'te Sui cüzdanından gelen gerçek hash kullanılacak.
      const fakeTxDigest = "0x" + Math.random().toString(16).slice(2);

      const res = await localizationClient.confirm({
        geoTxId,
        txDigest: fakeTxDigest
      });

      setConfirmResult(res);
    } catch (err: any) {
      console.error("confirm error", err);
      setError(err?.message || "Confirm sırasında hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-xl p-6 rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg space-y-6">
        <h1 className="text-2xl font-bold">Localization Demo Dapp</h1>
        <p className="text-sm text-slate-300">
          Bu demo, Localization altyapısının bir dapp&apos;e nasıl entegre
          edileceğini gösterir. Start → Confirm → Score akışı çalışıyor mu,
          jürilere buradan gösterebilirsin.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Kullanıcı Address</label>
            <input
              className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm mb-1">Şehir</label>
              <input
                className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
              />
            </div>
            <div className="w-24">
              <label className="block text-sm mb-1">Ülke</label>
              <input
                className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">SUI Miktarı (Score)</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm"
              value={amountSui}
              onChange={(e) => setAmountSui(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-400 border border-red-500/40 bg-red-500/10 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleStart}
            disabled={loading}
            className="flex-1 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-sm font-semibold disabled:opacity-50"
          >
            1️⃣ Start (Intent)
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-sm font-semibold disabled:opacity-50"
          >
            2️⃣ Confirm (Score)
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <h2 className="font-semibold mb-1">Start Sonucu</h2>
            <pre className="bg-slate-950/60 border border-slate-800 rounded-md p-3 text-xs overflow-x-auto">
              {startResult
                ? JSON.stringify(startResult, null, 2)
                : "Henüz start çağrılmadı."}
            </pre>
          </div>

          <div>
            <h2 className="font-semibold mb-1">Confirm Sonucu</h2>
            <pre className="bg-slate-950/60 border border-slate-800 rounded-md p-3 text-xs overflow-x-auto">
              {confirmResult
                ? JSON.stringify(confirmResult, null, 2)
                : "Henüz confirm çağrılmadı."}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
