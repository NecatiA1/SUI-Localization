import Documentation from '@/components/documentation';
import ApiGeneratorCard from "@/components/apigeneratorCard";


export default function DocumentationPage() {
  return (
    <main className="px-72 py-8 space-y-12 pt-20">
      <Documentation />

      {/* Yeni API Kartı */}
      <ApiGeneratorCard />
    </main>
  );
}