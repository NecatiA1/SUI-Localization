"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

// react-globe.gl sadece client tarafında yüklensin
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-white">
      Loading globe...
    </div>
  ),
});

// --- ŞEHİR VERİLERİ ---
// --- 100 ŞEHİR VERİSİ ---  
const cities = [
  { id: 1, name: "City-1", code: "C01", transactions: 1820, score: 327, lat: 41.0082, lng: 28.9784 },
  { id: 2, name: "City-2", code: "C02", transactions: 850, score: 21, lat: 37.9334, lng: 32.8597 },
  { id: 3, name: "City-3", code: "C03", transactions: 720, score: 628, lat: 38.1237, lng: 27.8428 },
  { id: 4, name: "City-4", code: "C04", transactions: 2100, score: 92, lat: 51.5074, lng: -0.1278 },
  { id: 5, name: "City-5", code: "C05", transactions: 3500, score: 5, lat: 40.7128, lng: -74.006 },
  { id: 6, name: "City-6", code: "C06", transactions: 2800, score: 10, lat: 35.6762, lng: 139.6503 },
  { id: 7, name: "City-7", code: "C07", transactions: 1800, score: 288, lat: 48.8566, lng: 2.3522 },
  { id: 8, name: "City-8", code: "C08", transactions: 1400, score: 80, lat: 52.52, lng: 13.405 },
  { id: 9, name: "City-9", code: "C09", transactions: 1600, score: 53, lat: 25.2048, lng: 55.2708 },
  { id: 10, name: "City-10", code: "C10", transactions: 2200, score: 141, lat: 1.3521, lng: 103.8198 },

  // 90 adet tamamen rastgele veri
  ...Array.from({ length: 90 }).map((_, i) => ({
    id: i + 11,
    name: `City-${i + 11}`,
    code: `C${String(i + 11).padStart(2, "0")}`,
    transactions: Math.floor(Math.random() * 5000) + 50,   // 50 - 5000 arası
    score: Math.floor(Math.random() * 800) + 1,             // 1 - 800 arası
    lat: parseFloat((Math.random() * 180 - 90).toFixed(4)), // -90 ile 90 arası
    lng: parseFloat((Math.random() * 360 - 180).toFixed(4)) // -180 ile 180 arası
  }))
];


export default function StylizedCityGlobe() {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [hoveredCity, setHoveredCity] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  const pointsData = cities;

  // Skora göre tooltip içi renk
  const getScoreColor = (score) => {
    if (score >= 300) return "#4ade80"; // yüksek
    if (score >= 100) return "#fbbf24"; // orta
    return "#f87171"; // düşük
  };

  // Dönüşü durdur
  function stopRotation() {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    if (!controls) return;
    controls.autoRotate = false;
  }

  // Dönüşü tekrar başlat (saat yönünde)
  function resumeRotation() {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    if (!controls) return;
    controls.autoRotate = true;
    controls.autoRotateSpeed = -0.6; // negatif => saat yönü
  }

  useEffect(() => {
    setMounted(true);

    // Ülke sınırları
    fetch(
      "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson"
    )
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  const handlePointHover = (point) => {
    setHoveredCity(point || null);

    if (typeof document !== "undefined") {
      document.body.style.cursor = point ? "pointer" : "default";
    }

    if (point) {
      // Tooltip açıldı → dönmeyi durdur
      stopRotation();
    } else {
      // Tooltip kapandı → dönmeyi sürdür
      resumeRotation();
    }
  };

  if (!mounted) return null;

  return (
    <div
    style={{
      width: "100%",
      height: "100%",      // yüksekliği artık parent belirleyecek
      position: "relative",
      background: "#000",
    }}
      onMouseMove={(e) => {
        setTooltipPos({ x: e.clientX, y: e.clientY });
      }}
    >
      <Globe
        ref={globeEl}
        backgroundColor="#000000"
        globeImageUrl={null}
        showGlobe={true}
        globeMaterial={
          new THREE.MeshPhongMaterial({
            color: "#1a202c", // koyu gri küre
            shininess: 0.7,
          })
        }
        showAtmosphere={true}
        atmosphereColor="#3a228a"
        atmosphereAltitude={0.15}
        onGlobeReady={() => {
          if (!globeEl.current) return;

          globeEl.current.pointOfView(
            { lat: 39, lng: 34, altitude: 2 },
            1000
          );

          // İlk açılışta dönmeyi başlat
          resumeRotation();
        }}
        // --- ÜLKELER (hover rengi yok) ---
        polygonsData={countries.features}
        polygonCapColor={() => "#2d3748"}
        polygonSideColor={() => "rgba(0, 0, 0, 0)"}
        polygonStrokeColor={() => "#718096"}
        polygonLabel={() => ""}
        onPolygonHover={null}
        polygonsTransitionDuration={300}
        // --- ŞEHİR ÇUBUKLARI ---
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "#22c55e"}
        pointAltitude={(d) => d.score / 3000 + 0.01}
        pointRadius={0.12}  // ince çubuk
        pointLabel={() => ""}
        onPointHover={handlePointHover}
      />

      {/* TOOLTIP */}
      {hoveredCity && (
        <div
          style={{
            position: "fixed",
            left: tooltipPos.x + 15,
            top: tooltipPos.y + 15,
            background: "rgba(0, 0, 0, 0.9)",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "8px",
            pointerEvents: "none",
            zIndex: 1000,
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "8px",
              color: "#fff",
            }}
          >
            {hoveredCity.name}
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <div>
              <span style={{ opacity: 0.7 }}>Kod:</span> {hoveredCity.code}
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>İşlem:</span>{" "}
              {hoveredCity.transactions.toLocaleString()}
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>Skor:</span>{" "}
              <span
                style={{
                  color: getScoreColor(hoveredCity.score),
                  fontWeight: "bold",
                }}
              >
                {hoveredCity.score}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
