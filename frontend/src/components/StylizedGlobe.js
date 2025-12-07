"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import useGlobalStore from "@/store/useGlobalStore"; // Store Import

// IMPORT: Ayrılan Bileşenler
import CityModal from "@/components/CityModal";
import UserModal from "@/components/UserModal";
import CommunityModal from "@/components/CommunityModal";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-black text-white">Loading...</div>,
});

export default function StylizedCityGlobe() {
  const globeEl = useRef();
  
  // Store'dan sadece şehirleri ve seçim aksiyonunu çekiyoruz
  const { cities, fetchCities, selectCity, selectedCity } = useGlobalStore();
  
  const [countries, setCountries] = useState({ features: [] });
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: null });

  // Skor rengi hesaplaması
  const getScoreColor = (score) => {
    if (score >= 700) return "#22c55e"; 
    if (score >= 400) return "#eab308"; 
    return "#ef4444"; 
  };

  useEffect(() => {
    setMounted(true);
    // 1. Şehir verilerini Store'dan iste
    fetchCities();

    fetch("https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- GLOBE ETKİLEŞİMLERİ ---
  const pauseRotation = () => { if (globeEl.current) globeEl.current.controls().autoRotate = false; };
  
  const resumeRotation = () => { 
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
    }
  };

  const handleHover = (point, event) => {
    if (point) {
        document.body.style.cursor = "pointer";
        pauseRotation();
        setTooltip({ visible: true, x: 0, y: 0, content: point });
    } else {
        document.body.style.cursor = "default";
        // Eğer bir şehir seçili değilse dönmeye devam et
        if (!selectedCity) resumeRotation();
        setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  const handlePointClick = (point) => {
    if (!point) return;
    
    selectCity(point);
    
    setTooltip({ visible: false, x: 0, y: 0, content: null });
    pauseRotation();

    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.8 }, 1200);
    }
  };

  // Popup kapandığında Globe'u eski haline getirmek için
  useEffect(() => {
    if (!selectedCity && globeEl.current) {
       const currentPos = globeEl.current.pointOfView();
       if(currentPos.altitude < 2.0) {
           globeEl.current.pointOfView({ ...currentPos, altitude: 2.5 }, 1000);
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
        onMouseMove={(e) => {
            if(tooltip.visible) {
                setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
            }
        }}
    >
      
<Globe
        ref={globeEl}
        backgroundColor="#050505"
        globeMaterial={new THREE.MeshPhongMaterial({ color: "#111827", emissive: "#000000", shininess: 0.7 })}
        showAtmosphere={true}
        atmosphereColor="#38bdf8"
        atmosphereAltitude={0.15}
        onGlobeReady={() => { if (globeEl.current) { globeEl.current.pointOfView({ lat: 25, lng: 35, altitude: 2.5 }); resumeRotation(); }}}
        
        // ÜLKELER
        polygonsData={countries.features}
        polygonCapColor={() => "#1f2937"}
        polygonSideColor={() => "rgba(0,0,0,0)"}
        polygonStrokeColor={() => "#374151"}
        polygonLabel={() => ""}

        // --- NOKTALAR (Eski çubuklar, şimdi pul oldu) ---
        pointsData={cities}
        // RENK: Skor rengiyle birebir aynı
        pointColor={(d) => getScoreColor(d.score)} 
        // BOYUT: Noktanın genişliği
        pointRadius={0.15} 
        // YÜKSEKLİK: 0.01 yaparak çubuk hissini yok ettik, yere yapıştırdık
        pointAltitude={0.01} 
        // KALİTE: Yuvarlak görünmesi için çözünürlüğü artırdık
        pointResolution={30} 
        pointLabel={() => ""}
        onPointClick={handlePointClick}
        onPointHover={handleHover}

        // HALKALAR
        ringsData={cities}
        ringAltitude={0.01} // Halka ile nokta aynı hizada olsun
        onRingClick={handlePointClick}
        onRingHover={handleHover}
        ringColor={(d) => (t) => { 
            const hex = getScoreColor(d.score); 
            let r=34,g=197,b=94; 
            if(hex === "#eab308") { r=234;g=179;b=8; } 
            else if(hex === "#ef4444") { r=239;g=68;b=68; } 
            return `rgba(${r},${g},${b},${1 - t})`; 
        }}
        ringMaxRadius={(d) => 2.0 + (d.transactions / 5000)}
        ringPropagationSpeed={1.5}
        ringRepeatPeriod={800}
      />

      {/* TOOLTIP */}
      {tooltip.visible && tooltip.content && !selectedCity && (
        <div 
            className="fixed z-50 pointer-events-none bg-slate-900/80 backdrop-blur-md border border-slate-600 px-4 py-2 rounded-lg shadow-xl text-sm"
            style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
        >
            <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getScoreColor(tooltip.content.score) }}></div>
                 <span className="font-semibold text-white tracking-wide">
                    {tooltip.content.region} <span className="text-slate-400 mx-1">/</span> {tooltip.content.name}
                 </span>
            </div>
        </div>
      )}

      {/* Modallar */}
      <CityModal />
      <UserModal />
      <CommunityModal />

    </div>
  );
}