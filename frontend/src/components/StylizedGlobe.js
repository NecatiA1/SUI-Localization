"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import useGlobalStore from "@/store/useGlobalStore";

// Modallar
import CityModal from "@/components/CityModal";
import UserModal from "@/components/UserModal";
import CommunityModal from "@/components/CommunityModal";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black text-white">
      Loading...
    </div>
  ),
});

export default function StylizedCityGlobe() {
  const globeEl = useRef();

  const { cities, fetchCities, selectCity, selectedCity } = useGlobalStore();

  const [countries, setCountries] = useState({ features: [] });
  const [mounted, setMounted] = useState(false);
  
  // Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });

  const getScoreColor = (score) => {
    if (score >= 700) return "#22c55e"; // Yeşil
    if (score >= 400) return "#eab308"; // Sarı
    return "#ef4444"; // Kırmızı
  };

  useEffect(() => {
    setMounted(true);
    fetchCities();

    fetch(
      "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson"
    )
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, [fetchCities]);

  const pauseRotation = () => {
    if (globeEl.current) globeEl.current.controls().autoRotate = false;
  };

  const resumeRotation = () => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
  };

  // Hover mantığı: Görünmez küreye gelince çalışır
  const handleHover = (obj) => {
    if (obj) {
      document.body.style.cursor = "pointer";
      pauseRotation();
      // İçerik set edilir, görünür hale gelir.
      // Pozisyon (x,y) div'in onMouseMove'undan güncellenir.
      setTooltip((prev) => ({ ...prev, visible: true, content: obj }));
    } else {
      document.body.style.cursor = "default";
      if (!selectedCity) resumeRotation();
      setTooltip((prev) => ({ ...prev, visible: false, content: null }));
    }
  };

  const handlePointClick = (point) => {
    if (!point) return;

    selectCity(point);
    setTooltip({ visible: false, x: 0, y: 0, content: null });
    pauseRotation();

    if (globeEl.current) {
      globeEl.current.pointOfView(
        { lat: point.lat, lng: point.lng, altitude: 1.8 },
        1200
      );
    }
  };

  useEffect(() => {
    if (!selectedCity && globeEl.current) {
      const currentPos = globeEl.current.pointOfView();
      if (currentPos.altitude < 2.0) {
        globeEl.current.pointOfView(
          { ...currentPos, altitude: 2.5 },
          1000
        );
        setTimeout(resumeRotation, 1000);
      } else {
        resumeRotation();
      }
    }
  }, [selectedCity]);

  if (!mounted) return null;

  return (
    <div 
        className="w-full h-screen relative bg-black overflow-hidden font-sans text-white"
        // Tooltip'in mouse'u takip etmesi için en dış div'i dinliyoruz
        onMouseMove={(e) => {
            if (tooltip.visible) {
                setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
            }
        }}
    >
      <Globe
        ref={globeEl}
        backgroundColor="#050505"
        globeMaterial={
          new THREE.MeshPhongMaterial({
            color: "#111827",
            emissive: "#000000",
            shininess: 0.7,
          })
        }
        showAtmosphere={true}
        atmosphereColor="#38bdf8"
        atmosphereAltitude={0.15}
        onGlobeReady={() => {
          if (globeEl.current) {
            globeEl.current.pointOfView(
              { lat: 25, lng: 35, altitude: 2.5 },
              0
            );
            resumeRotation();
          }
        }}
        
        // --- Ülkeler Haritası ---
        polygonsData={countries.features}
        polygonCapColor={() => "#1f2937"}
        polygonSideColor={() => "rgba(0,0,0,0)"}
        polygonStrokeColor={() => "#374151"}
        polygonLabel={() => ""} // Varsayılan etiketi kapatır

        // --- GÖRSEL NOKTALAR (Tıklanmaz, sadece görünür) ---
        pointsData={cities}
        pointColor={(d) => getScoreColor(d.score)}
        pointRadius={0.15}
        pointAltitude={0.01}
        pointResolution={30}
        pointLabel={() => ""} // Varsayılan etiketi kapatır (önemli)

        // --- GÖRÜNMEZ TIKLAMA ALANLARI (Hitbox) ---
        objectsData={cities}
        objectLabel={() => ""} // Hitbox üzerindeki varsayılan yazıyı da kapatır
        onObjectClick={(obj, event) => handlePointClick(obj)}
        onObjectHover={(obj) => handleHover(obj)}
        objectThreeObject={() => {
          // Görünmez, büyük küre (Hitbox)
          return new THREE.Mesh(
            new THREE.SphereGeometry(1.5, 16, 16), // Yarıçap 1.5 (Geniş alan)
            new THREE.MeshBasicMaterial({ 
              opacity: 0.0, // Tamamen şeffaf
              transparent: true 
            })
          );
        }}

        // --- Halkalar (Opsiyonel Görsel) ---
        ringsData={cities}
        ringAltitude={0.01}
        ringColor={(d) => (t) => {
          const hex = getScoreColor(d.score);
          let r = 34, g = 197, b = 94;
          if (hex === "#eab308") { r = 234; g = 179; b = 8; }
          else if (hex === "#ef4444") { r = 239; g = 68; b = 68; }
          return `rgba(${r},${g},${b},${1 - t})`;
        }}
        ringMaxRadius={(d) => 2.0 + d.transactions / 5000}
        ringPropagationSpeed={1.5}
        ringRepeatPeriod={800}
      />

      {/* --- ÖZEL TOOLTIP (İstediğiniz Yeşil İkonlu Yapı) --- */}
      {tooltip.visible && tooltip.content && !selectedCity && (
        <div
          className="fixed z-50 pointer-events-none bg-slate-900/90 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-lg shadow-2xl text-sm transition-opacity duration-150"
          style={{ 
            left: tooltip.x + 15, // Mouse'un biraz sağına
            top: tooltip.y + 15   // Mouse'un biraz altına
          }}
        >
          <div className="flex items-center gap-3">
            {/* Skor Rengi İkonu */}
            <div className="relative flex items-center justify-center">
                 <div
                    className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    style={{ backgroundColor: getScoreColor(tooltip.content.score) }}
                 />
                 {/* Hafif bir parlama efekti */}
                 <div 
                    className="absolute w-3 h-3 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: getScoreColor(tooltip.content.score) }}
                 />
            </div>
            
            {/* Şehir Bilgisi */}
            <div className="flex flex-col">
                <span className="font-bold text-white text-base leading-tight">
                  {tooltip.content.name}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {tooltip.content.region}
                </span>
            </div>
          </div>
        </div>
      )}

      <CityModal />
      <UserModal />
      <CommunityModal />
    </div>
  );
}