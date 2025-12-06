import StylizedGlobe from "@/components/StylizedGlobe";

export default function LocalizationPage() {
  return (
    <main className="flex">
      {/* Sol taraf: Globe */}
      <div className="w-1/2 h-[50vh]">
        <StylizedGlobe />
      </div>

      {/* Sağ taraf: İleride ekleyeceğin panel / tablo vs. */}
      <div className="w-1/2 h-[50vh]">
        {/* buraya sağ taraftaki içerik gelecek */}
      </div>
    </main>
  );
}
