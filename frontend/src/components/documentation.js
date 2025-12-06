"use client";

import React from "react";
import { FiBookOpen } from "react-icons/fi";

export default function Documentation() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-zinc-800/80 
      bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-7 
      shadow-xl shadow-black/40"
    >
      {/* Violet top line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0" />

      {/* Glow circle */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/30">
          <FiBookOpen className="text-xl" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">
            Localization SDK Docs
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Quick integration guide for sending geo-aware activity.
          </p>
        </div>
      </div>

      {/* Body */}
      <article className="prose prose-invert max-w-none text-zinc-300 leading-relaxed">

        {/* --- What is Localization? --- */}
        <h3 className="text-base text-zinc-100">What is Localization?</h3>
        <p className="text-sm">
          Localization lets dapps or communities send city-level usage signals to a shared backend.  
          Each confirmed Sui transaction receives scores and updates city + user activity.
        </p>

        {/* --- Install --- */}
        <h3 className="mt-6 text-base text-zinc-100">Install</h3>
        <pre className="bg-black/60 border border-zinc-800 rounded-md p-3 text-xs overflow-x-auto">
{`npm install localization-sui-sdk`}
        </pre>

        {/* --- Setup Client --- */}
        <h3 className="mt-6 text-base text-zinc-100">Setup Client</h3>
        <pre className="bg-black/60 border border-zinc-800 rounded-md p-3 text-xs overflow-x-auto">
{`import { createLocalizationClient } from "localization-sui-sdk";

export const localizationClient = createLocalizationClient({
  apiId: process.env.NEXT_PUBLIC_LOCALIZATION_API_ID!,
  apiKey: process.env.NEXT_PUBLIC_LOCALIZATION_API_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_LOCALIZATION_API_URL!,
});`}
        </pre>

        {/* --- Start --- */}
        <h3 className="mt-6 text-base text-zinc-100">1) Start Intent</h3>
        <p className="text-sm">Call <code>start()</code> before sending a Sui transaction.</p>
        <pre className="bg-black/60 border border-zinc-800 rounded-md p-3 text-xs overflow-x-auto">
{`const startRes = await localizationClient.start({
  userAddress: suiAddress,
  cityName: "Istanbul",
  countryCode: "TR",
});`}
        </pre>

        {/* --- Confirm --- */}
        <h3 className="mt-6 text-base text-zinc-100">2) Confirm Transaction</h3>
        <p className="text-sm">
          After the user signs the Sui tx, confirm it with the hash + amount.
        </p>
        <pre className="bg-black/60 border border-zinc-800 rounded-md p-3 text-xs overflow-x-auto">
{`const confirmRes = await localizationClient.confirm({
  geoTxId: startRes.geoTxId,
  txDigest,
  amountSui: 10,
});`}
        </pre>

        {/* --- Note --- */}
        <div className="mt-5 bg-zinc-900/70 p-4 rounded-lg border border-zinc-800 text-sm">
          <strong className="text-zinc-100">Note:</strong>{" "}
          The score varies depending on the transaction amount and the region from which the user is sending.
        </div>
      </article>
    </section>
  );
}
