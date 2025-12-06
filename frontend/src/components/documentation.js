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
      {/* Üst violet glow çizgisi */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px 
        bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0"
      />

      {/* Arka blur violet daire */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 
        rounded-full bg-violet-500/10 blur-3xl"
      />

      {/* Başlık */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl 
          bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/30"
        >
          <FiBookOpen className="text-xl" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Dokümantasyon</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Proje ile ilgili tüm teknik açıklamalar ve kullanım detayları.
          </p>
        </div>
      </div>

      {/* İçerik */}
      <article className="prose prose-invert max-w-none text-zinc-300 leading-relaxed">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          imperdiet nulla et dictum interdum, nisi lorem egestas vitae
          scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices
          nec congue eget, auctor vitae massa.
        </p>

        <div
          className="mt-5 bg-zinc-900/70 p-4 rounded-lg border border-zinc-800 
          ring-1 ring-violet-600/20 shadow-inner shadow-black/20"
        >
          <p className="text-sm">
            <strong className="text-zinc-100">Not:</strong>{" "}
            Fusce luctus odio ac nibh luctus, in porttitor. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur.
          </p>
        </div>
      </article>
    </section>
  );
}
