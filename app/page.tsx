import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductExplorer from "@/components/ProductExplorer";
import InteriorDetail from "@/components/InteriorDetail";
import { Cases, Contact, Install } from "@/components/Sections";
import { siteConfig } from "@/content/site";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero layout={siteConfig.heroLayout} />
        <ProductExplorer view={siteConfig.productView} />
        <InteriorDetail />
        <Install />
        <Cases />
        <Contact />
      </main>
    </>
  );
}
