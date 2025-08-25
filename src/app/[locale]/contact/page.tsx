'use client';

import ContactForm from "@/components/ContactForm";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Clock, Users, Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const t = useTranslations('contact');

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-blue-500" />,
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Contact Methods Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
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
                  >
                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-gray-50 rounded-full mb-4 group-hover:bg-blue-50 transition-colors">
                          {method.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                        <p className="text-blue-600 font-medium hover:text-blue-700">{method.value}</p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-gray-50 rounded-full mb-4">
                        {method.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{method.description}</p>
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
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t('title') || 'Contact Us'}
                </h2>
                <p className="text-xl text-gray-600">
                  {t('pageSubtitle') || 'Send us a message and we\'ll get back to you soon!'}
                </p>
              </div>
              <ContactForm />
            </div>
          </div>

        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}