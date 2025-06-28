import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DormSearchPage } from "@/components/DormSearchPage";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: "en" | "de" | "tr" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dormSearch" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: "yurt, öğrenci yurdu, München, Munich, Türk öğrenciler, student housing, dormitory",
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function EvAramaPage({
  params
}: {
  params: Promise<{ locale: "en" | "de" | "tr" }>;
}) {
  // Params await edilmeli ama locale'i kullanmıyoruz
  await params;
  
  return (
    <main>
      <DormSearchPage />
    </main>
  );
}
