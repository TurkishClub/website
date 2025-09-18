'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { RaycastBackground } from '@/components/ui/raycast-animated-background';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from '@/lib/analytics';

export default function DevelopersPageClient() {
  const t = useTranslations('developers');

  useEffect(() => {
    Analytics.trackPageView({
      page_title: 'Developers Community',
      page_type: 'other'
    });
  }, []);

  const handleJoinClick = () => {
    Analytics.trackNavigation({
      action: 'external_link',
      link_text: 'Developers Join Button',
      destination: '/contact'
    });
    // For now, we'll redirect to the contact page
    // In the future, this could link to a developer-specific form or Discord/Slack
    window.open('/contact', '_blank');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <RaycastBackground />
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen px-4 py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl text-center md:text-left text-white md:ml-8 lg:ml-16">
            {/* Hero Section */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-center md:text-left
               mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Turkish 
                  <br />
                  Club
                  <br />
                  <>
                      <span className="font-mono text-white antialiased devGlow">
                          Developers
                      </span>
                      <style jsx>{`
                          .devGlow {
                              /* Moderate white glow */
                              text-shadow: 0 0 6px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.4), 0 0 18px rgba(255, 255, 255, 0.3);
                              animation: breatheGlow 3s ease-in-out infinite;
                          }
                          @keyframes breatheGlow {
                              0%, 100% {
                                  text-shadow: 0 0 4px rgba(255, 255, 255, 0.4), 0 0 8px rgba(255, 255, 255, 0.3), 0 0 12px rgba(255, 255, 255, 0.2);
                              }
                              50% {
                                  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6), 0 0 24px rgba(255, 255, 255, 0.4);
                              }
                          }
                      `}</style>
                  </>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto md:mx-0 leading-relaxed text-center md:text-left">
              </p>
            </div>

      
            {/* Call to Action */}
            <div className="text-center md:text-left">
              <Button
                onClick={handleJoinClick}
                className='bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
              >
                {t('cta.button')}
              </Button>
              <p className="text-sm text-gray-400 mt-4">
                {t('cta.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}