"use client";

import React, { useState } from "react";
import { FiBookOpen, FiCheck, FiCopy } from "react-icons/fi";

const CodeBlock = ({ code, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative mb-6">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300" />
      <div className="relative bg-black/80 backdrop-blur-sm border border-zinc-700 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">{title}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1 text-xs text-zinc-400 hover:text-violet-300 transition rounded hover:bg-zinc-800/50"
          >
            {copied ? (
              <>
                <FiCheck className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <FiCopy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="p-4 text-xs overflow-x-auto text-zinc-300 font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const StepCard = ({ title, description, code }) => {
  return (
    <div className="relative mb-8 last:mb-0">
      <div className="flex gap-4">
        {/* Content */}
        <div className="flex-grow">
          <h4 className="text-base font-semibold text-zinc-100 mb-2">{title}</h4>
          <p className="text-sm text-zinc-400 mb-4">{description}</p>
          <CodeBlock code={code} title={title} />
        </div>
      </div>
    </div>
  );
};

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
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-400 ring-2 ring-violet-500/50">
          <FiBookOpen className="text-2xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Localization SDK Docs
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Quick integration guide for sending geo-aware activity
          </p>
        </div>
      </div>

      {/* Body */}
      <article className="space-y-6">

        {/* --- What is Localization? --- */}
        <div className="rounded-lg border border-zinc-700 bg-zinc-900/30 p-4 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2">About</h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Localization lets dapps or communities send city-level usage signals to a shared backend. Each confirmed Sui transaction receives scores and updates city + user activity.
          </p>
        </div>

        {/* --- Install --- */}
        <div>
          <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-wide mb-3">Installation</h3>
          <CodeBlock 
            code={`npm install localization-sui-sdk`}
            title="npm"
          />
        </div>

        {/* --- Setup Client --- */}
        <div>
          <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-wide mb-3">Setup Client</h3>
          <CodeBlock 
            code={`import { createLocalizationClient } from "localization-sui-sdk";

export const localizationClient = createLocalizationClient({
  apiId: process.env.NEXT_PUBLIC_LOCALIZATION_API_ID!,
  apiKey: process.env.NEXT_PUBLIC_LOCALIZATION_API_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_LOCALIZATION_API_URL!,
});`}
            title="typescript"
          />
        </div>

        {/* --- Steps --- */}
        <div>
          <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-wide mb-4">Integration Steps</h3>
          <div className="space-y-6">
            <StepCard
              title="Start Intent"
              description="Call start() before sending a Sui transaction."
              code={`const startRes = await localizationClient.start({
  userAddress: suiAddress,
  cityName: "Istanbul",
  countryCode: "TR",
});`}
            />
            
            <StepCard
              title="Confirm Transaction"
              description="After the user signs the Sui tx, confirm it with the hash + amount."
              code={`const confirmRes = await localizationClient.confirm({
  geoTxId: startRes.geoTxId,
  txDigest,
  amountSui: 10,
});`}
            />
          </div>
        </div>

        {/* --- Note --- */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/40 to-orange-600/40 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300" />
          <div className="relative bg-amber-950/40 backdrop-blur-sm p-4 rounded-lg border border-amber-800/50">
            <strong className="text-amber-300">⚡ Note:</strong>{" "}
            <span className="text-amber-100 text-sm">
              The score varies depending on the transaction amount and the region from which the user is sending.
            </span>
          </div>
        </div>
      </article>
    </section>
  );
}
