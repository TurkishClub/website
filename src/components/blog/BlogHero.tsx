'use client';

import {useEffect, useState} from 'react';

const animatedQuestions = [
  'Ev Nasıl Bulunur?',
  'Oturma İzni Nasıl Yenilenir?',
  'Alman Dili Nasıl Öğrenilir?',
  'İş Başvurusu Nasıl Yapılır?',
  'Sağlık Sigortası Nasıl Alınır?',
  'Vize İşlemleri Nasıl Yapılır?',
  'Banka Hesabı Nasıl Açılır?',
  'Anmeldung Nasıl Yapılır?'
];

export function BlogHero() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentQuestionIndex(
          (prev) => (prev + 1) % animatedQuestions.length
        );
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative  bg-[#C61E1E] text-white overflow-hidden">
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl lg:text-7xl font-bold mb-4 leading-tight">
              Blog
            </h1>
          </div>

          <div className="mb-12 h-20 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg lg:text-xl text-red-100 mb-4">
                Sorularınza cevaplar burada!
              </p>
              <div
                className={`text-2xl lg:text-4xl font-semibold transition-all duration-300 transform ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{minHeight: '3rem'}}
                aria-live="polite"
              >
                {animatedQuestions[currentQuestionIndex]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
