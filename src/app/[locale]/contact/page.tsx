'use client';

import ContactForm from "@/components/ContactForm";
import { useTranslations } from "next-intl";
import { Mail, Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { Analytics } from "@/lib/analytics";

export default function ContactPage() {
  const t = useTranslations('contact');

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-[#C61E1E]" />,
      title: "Email",
      description: "Send us a message anytime",
      value: "info@turkishclub.munich",
      link: "mailto:info@turkishclub.munich"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-green-500" />,
      title: "WhatsApp",
      description: "Join our community chat",
      value: "Community Group",
      link: "https://chat.whatsapp.com/LHzs06mN7iCG2cXlZHpZs9"
    },
    {
      icon: <Instagram className="h-6 w-6 text-pink-500" />,
      title: "Instagram",
      description: "Follow our updates",
      value: "@turkishclub.munich",
      link: "https://www.instagram.com/turkishclub.munich/"
    },
  ];

  // Analytics: track page view + engagement like other pages
  useEffect(() => {
    Analytics.trackPageView({
      page_title: 'Turkish Club - Contact',
      page_type: 'other'
    });

    const cleanupScroll = Analytics.trackScrollDepth();
    const cleanupSession = Analytics.trackSessionDuration();

    return () => {
      if (cleanupScroll) cleanupScroll();
      if (cleanupSession) cleanupSession();
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-[#C61E1E] text-white py-24">
          <div className="w-[80%] mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('title') || 'Contact Us'}
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {t('pageSubtitle') || 'Send us a message and we\'ll get back to you soon!'}
            </p>
          </div>
        </section>

        {/* Contact Methods Section */}
        <section className="py-20 px-4">
          <div className="w-[80%] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
                {t('methodsTitle') || 'Ways to Connect'}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('methodsSubtitle') || 'Choose your preferred way to reach out to us'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 justify-items-center">
              {contactMethods.map((method, index) => (
                <div key={index} className="group w-full max-w-sm">
                  {method.link ? (
                    <Link
                      href={method.link}
                      target={method.link.startsWith('http') ? '_blank' : undefined}
                      rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={`${method.title}: ${method.value}`}
                      onClick={() =>
                        Analytics.trackNavigation({
                          action: 'external_link',
                          link_text: method.title,
                          destination: method.link
                        })
                      }
                    >
                      <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 border border-gray-100">
                        <div className="flex flex-col items-center text-center">
                          <div className="p-4 bg-gray-50 rounded-full mb-6 group-hover:bg-red-50 transition-colors">
                            {method.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">{method.title}</h3>
                          <p className="text-gray-600 mb-4">{method.description}</p>
                          <p className="text-[#C61E1E] font-medium hover:text-red-700">{method.value}</p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-4 bg-gray-50 rounded-full mb-6">
                          {method.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{method.title}</h3>
                        <p className="text-gray-600 mb-4">{method.description}</p>
                        <p className="text-gray-700 font-medium">{method.value}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Form Section */}
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}