"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// Tek JSON veri (score dahil)
const cities = [
  { id: 1, name: "İstanbul", code: "IST", transactions: 1250, score: 327, lat: 41.0082, lng: 28.9784 },
  { id: 2, name: "Ankara", code: "ANK", transactions: 850, score: 21, lat: 39.9334, lng: 32.8597 },
  { id: 3, name: "İzmir", code: "IZM", transactions: 720, score: 628, lat: 38.4237, lng: 27.1428 },
  { id: 4, name: "London", code: "LON", transactions: 2100, score: 92, lat: 51.5074, lng: -0.1278 },
  { id: 5, name: "New York", code: "NYC", transactions: 3500, score: 5, lat: 40.7128, lng: -74.006 },
  { id: 6, name: "Tokyo", code: "TYO", transactions: 2800, score: 10, lat: 35.6762, lng: 139.6503 },
  { id: 7, name: "Paris", code: "PAR", transactions: 1800, score: 288, lat: 48.8566, lng: 2.3522 },
  { id: 8, name: "Berlin", code: "BER", transactions: 1400, score: 80, lat: 52.52, lng: 13.405 },
  { id: 9, name: "Dubai", code: "DXB", transactions: 1600, score: 53, lat: 25.2048, lng: 55.2708 },
  { id: 10, name: "Singapore", code: "SIN", transactions: 2200, score: 141, lat: 1.3521, lng: 103.8198 }
];

const CityGlobe = () => {
  const globeEl = useRef();
  const [hoveredCity, setHoveredCity] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Ülke sınırları için GeoJSON
  const [countries, setCountries] = useState([]);

  // Nokta verisi - useMemo ile sabit tut
  const pointsData = React.useMemo(
    () =>
      cities.map((city) => ({
        ...city,
        size: 0.12
      })),
    []
  );

  // Ülke poligonlarını yükle
  useEffect(() => {
    // İstersen burayı /data/world.geojson gibi local path ile değiştirebilirsin
    fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data.features || []);
      })
      .catch((err) => console.error("GeoJSON yüklenirken hata:", err));
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      globeEl.current.pointOfView({ lat: 39, lng: 34, altitude: 2 }, 1200);

      // Denizlerin görünmemesi için globe materyalini tamamen şeffaf yap
      const globeMaterial = globeEl.current.globeMaterial();
      globeMaterial.opacity = 0;
      globeMaterial.transparent = true;
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: "#000",
        overflow: "hidden"
      }}
      // Fareyi takip etmek için container üzerinde mousemove
      onMouseMove={(e) => {
        setTooltipPos({ x: e.clientX, y: e.clientY });
      }}
    >
      <Globe
        ref={globeEl}
        // Uydu texture YOK, sadece poligonlar var
        globeImageUrl={null}
        bumpImageUrl={null}
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        //
        // Beyaz karalar + sınırlar için poligon ayarları
        //
        polygonsData={countries}
        polygonCapColor={() => "rgba(100,100,100,1)"}            // karalar beyaz
        polygonSideColor={() => "rgba(255,255,255,0.18)"}        // hafif yan yüzey
        polygonStrokeColor={() => "rgba(190,190,190,0.95)"}      // ülke sınırı çizgisi
        polygonsTransitionDuration={300}
        //
        // Şehir noktaları
        //
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={(d) => d.score / 3000}
        pointRadius={(d) => d.size}
        pointColor={() => "#00ffd0"}
        pointLabel={() => ""}
        onPointHover={(p) => setHoveredCity(p)}
      />

      {/* Mouse'u takip eden tooltip */}
      {hoveredCity && (
        <div
          style={{
            position: "fixed",
            left: tooltipPos.x + 14,
            top: tooltipPos.y + 14,
            transform: "translateZ(0)",
            background: "linear-gradient(180deg, rgba(10,10,10,0.95), rgba(20,20,20,0.95))",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
            pointerEvents: "none",
            zIndex: 9999,
            minWidth: 180,
            fontSize: 13,
            border: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>{hoveredCity.name}</div>
          <div style={{ opacity: 0.85, marginBottom: 4 }}>Kod: {hoveredCity.code}</div>
          <div style={{ opacity: 0.85, marginBottom: 4 }}>
            İşlem: {hoveredCity.transactions.toLocaleString()}
          </div>
          <div style={{ opacity: 0.95 }}>Skor: {hoveredCity.score}</div>
        </div>
      )}
    </div>
  );
};

export default CityGlobe;
