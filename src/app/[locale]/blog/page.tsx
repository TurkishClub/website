import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MobileNavbar from "@/components/MobileNavbar";
import BlogContent from "@/components/BlogContent";
import { getBlogPosts } from "@/lib/blog";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: "en" | "de" | "tr" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: "blog, news, Turkish community, München, Munich, insights, stories",
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

export default async function BlogPage({
  params
}: {
  params: Promise<{ locale: "en" | "de" | "tr" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getBlogPosts();

  return (
    <main className="bg-[#C61E1E] text-white min-h-screen">
      <MobileNavbar />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content with Search and Filtering */}
      <BlogContent posts={posts} />
    </main>
  );
}
