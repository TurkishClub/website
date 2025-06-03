import { Button } from "@/components/ui/button";
import React from "react";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import Polling from "@/components/Polling";
import MobileNavbar from "@/components/MobileNavbar";
import { useTranslations } from 'next-intl';
export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <main className="bg-[#C61E1E] min-h-screen text-white">
      <MobileNavbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24">
        <h1 className="text-6xl font-bold mb-4">{t('hero.title')}</h1>
        <p className="text-2xl mb-8">{t('hero.subtitle')}</p>
        <Button className="bg-[#222222] text-white px-4 py-4 rounded font-bold text-14">
          {t('hero.joinButton')}
        </Button>
      </section>
      <section className="bg-[#C61E1E] flex flex-col items-center justify-center text-center py-24 px-8">
        <iframe
          src="https://lu.ma/embed/event/evt-PUxkTGYj8APSGOV/simple"
          width="100%"
          height="800"
          className="max-w-[600px] sm:max-w-[600px] max-w-[300px] rounded"
          aria-hidden="false"
        />
      </section>


      <Polling />
      <FAQ />
      <Footer />

    </main>
  );
}

