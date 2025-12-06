"use client";

import { useState } from "react";
import { FiKey, FiCopy, FiCheckCircle } from "react-icons/fi";

export default function ApiGeneratorCard() {
  // 1. Değişiklik: 'username' yerine backend formatına uygun 'name' kullanıyoruz
  const [name, setName] = useState(""); 
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState("");

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 1500);
    } catch (err) {
      console.error("Kopyalama hatası:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsApproved(false);
    setError("");
    setApiData(null);

    try {
      // 2. Değişiklik: Endpoint'e gönderilen veri yapısı güncellendi
      const res = await fetch("http://localhost:4000/v1/apps/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name,       // Backend 'name' beklediği için 'username' yerine bunu gönderiyoruz
          domain, 
          description 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "API isteği başarısız oldu");
      }

      // 3. Değişiklik: Dönen JSON verisini (appId, apiKey, isNew vs.) state'e atıyoruz
      setApiData(data); 
      setIsApproved(true);
    } catch (err) {
      console.error(err);
      setError("Bir hata oluştu, tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validasyon kontrolü (name alanı için)
  const canSubmit = name.trim() && domain.trim() && description.trim() && !isSubmitting;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-zinc-800/80 
      bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-7 
      shadow-xl shadow-black/40"
    >
      {/* Dekoratif elemanlar (değişmedi) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0"/>
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl"/>

      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/30">
            <FiKey className="text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              API Erişimi Oluştur
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Uygulamanız için güvenli API anahtarı oluşturun.
            </p>
          </div>
        </div>

        <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
            isApproved
              ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/40"
              : "bg-zinc-900/80 text-zinc-400 ring-1 ring-zinc-800/80"
          }`}>
          {isApproved && <FiCheckCircle className="text-sm" />}
          <span>{isApproved ? "Başarılı" : "Formu doldur"}</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 4. Değişiklik: Label "Uygulama Adı" oldu ve value 'name' state'ine bağlandı */}
          <Input
            label="Uygulama Adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ör: SuiSwap"
          />

          <Input
            label="Web Domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="ör: https://app.suiswap.xyz"
          />
        </div>

        <TextArea
          label="Açıklama"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Bu API'nin kullanım amacı..."
          rows={3}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <div className="pt-1">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 
              text-sm font-medium transition-all duration-200
              ${
                canSubmit
                  ? "bg-violet-600/90 text-white shadow-lg shadow-violet-600/30 hover:bg-violet-500 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-zinc-900/80 text-zinc-500 ring-1 ring-zinc-800/80 cursor-not-allowed opacity-60"
              }`}
          >
            {isSubmitting
              ? "Oluşturuluyor..."
              : isApproved
              ? "Yeni Oluştur"
              : "API Oluştur"}
          </button>
        </div>
      </form>

      {/* API Sonuç Kartı */}
      {apiData && (
        <div className="mt-5 bg-zinc-900/70 p-4 rounded-lg border border-zinc-800 ring-1 ring-violet-600/20 shadow-inner shadow-black/20">
          <div className="flex items-center justify-between mb-3">
             <h3 className="text-sm font-semibold text-zinc-100">
               API Kimlik Bilgileri
             </h3>
             {/* Yeni oluşturuldu etiketi */}
             {apiData.isNew && (
               <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded border border-violet-500/30">
                 YENİ
               </span>
             )}
          </div>

          <div className="space-y-3 text-sm">
            
            {/* 5. Değişiklik: App ID Gösterimi (apiId yerine appId) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-zinc-500 uppercase tracking-wide">
                APP ID
              </span>
              <div className="flex items-center gap-2">
                <span className="flex-1 font-mono text-xs sm:text-[13px] text-zinc-100 break-all bg-zinc-900/70 rounded-md px-3 py-2">
                  {apiData.appId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(apiData.appId, "appId")}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-700/80 
                    bg-zinc-900/70 px-3 py-1.5 text-[11px] font-medium text-zinc-100 
                    hover:bg-zinc-800/80 transition-all"
                >
                  <FiCopy className="text-xs" />
                  {copiedField === "appId" ? "Kopyalandı" : "Kopyala"}
                </button>
              </div>
            </div>

            {/* API Key Gösterimi */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-zinc-500 uppercase tracking-wide">
                API Key
              </span>
              <div className="flex items-center gap-2">
                <span className="flex-1 font-mono text-xs sm:text-[13px] text-zinc-100 break-all bg-zinc-900/70 rounded-md px-3 py-2">
                  {apiData.apiKey}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(apiData.apiKey, "apiKey")}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-700/80 
                    bg-zinc-900/70 px-3 py-1.5 text-[11px] font-medium text-zinc-100 
                    hover:bg-zinc-800/80 transition-all"
                >
                  <FiCopy className="text-xs" />
                  {copiedField === "apiKey" ? "Kopyalandı" : "Kopyala"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}

// Yardımcı bileşenler (Label, ErrorText, Input, TextArea) aşağıda aynı kalabilir
function Label({ children }) {
  return <div className="text-xs font-medium uppercase tracking-wide text-zinc-400 mb-1.5">{children}</div>;
}

function ErrorText({ children }) {
  return <div className="text-xs mt-2 text-rose-400">{children}</div>;
}

function Input({ label, error, ...rest }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        {...rest}
        className={`w-full px-3 py-2 text-sm rounded-lg outline-none bg-zinc-900/40 text-zinc-50 
          placeholder-zinc-500 border transition-all
          ${error ? "border-rose-600 focus:ring-2 focus:ring-rose-600/40" : "border-zinc-800 focus:ring-2 focus:ring-violet-600/40"}`}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function TextArea({ label, error, ...rest }) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea
        {...rest}
        className={`w-full px-3 py-2 text-sm rounded-lg outline-none bg-zinc-900/40 text-zinc-50 
          placeholder-zinc-500 border transition-all resize-none
          ${error ? "border-rose-600 focus:ring-2 focus:ring-rose-600/40" : "border-zinc-800 focus:ring-2 focus:ring-violet-600/40"}`}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}