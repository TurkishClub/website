import { Code, PenTool, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FeatureProps {
  theme?: 'red' | 'black' | 'white';
}

function Feature({ theme = 'white' }: FeatureProps) {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const hoverScaleFor = (i: number) =>
    activeCard === null || activeCard === i ? 'hover:scale-105' : '';

  const themes = {
    red: {
      background: 'bg-[#C61E1E]',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
      badgeBorder: 'border-white/30',
      headingText: 'text-white',
      descriptionText: 'text-white/90',
      cardBg: 'bg-white/10',
      cardBorder: 'border-white/20',
      cardHoverBg: 'hover:bg-white',
      cardHoverBorder: 'hover:border-white',
      iconDefault: 'text-white',
      iconHover: 'group-hover:text-[#C61E1E]',
      iconActive: 'text-[#C61E1E]',
      titleDefault: 'text-white',
      titleHover: 'group-hover:hidden',
      textDefault: 'text-white/80',
      bulletColor: 'text-gray-950',
      activeCardBg: 'bg-white',
      activeCardBorder: 'border-white',
      buttonBg: 'bg-white',
      buttonText: 'text-[#C61E1E]',
      buttonBorder: 'border-gray-200',
      buttonHoverBg: 'group-hover:bg-black',
      buttonHoverText: 'group-hover:text-white',
      buttonHoverBorder: 'group-hover:border-gray-300',
      buttonActiveBg: 'bg-black',
      buttonActiveBorder: 'border-gray-300',
      buttonActiveText: 'text-white'
    },
    black: {
      background: 'bg-black',
      badgeBg: 'bg-white/10',
      badgeText: 'text-white',
      badgeBorder: 'border-white/20',
      headingText: 'text-white',
      descriptionText: 'text-white/80',
      cardBg: 'bg-white/5',
      cardBorder: 'border-white/10',
      cardHoverBg: 'hover:bg-white',
      cardHoverBorder: 'hover:border-white',
      iconDefault: 'text-white',
      iconHover: 'group-hover:text-black',
      iconActive: 'text-black',
      titleDefault: 'text-white',
      titleHover: 'group-hover:hidden',
      textDefault: 'text-white/70',
      bulletColor: 'text-black',
      activeCardBg: 'bg-white',
      activeCardBorder: 'border-white',
      buttonBg: 'bg-white',
      buttonText: 'text-black',
      buttonBorder: 'border-gray-200',
      buttonHoverBg: 'group-hover:bg-gray-100',
      buttonHoverText: 'group-hover:text-black',
      buttonHoverBorder: 'group-hover:border-gray-300',
      buttonActiveBg: 'bg-gray-100',
      buttonActiveBorder: 'border-gray-300',
      buttonActiveText: 'text-black'
    },
    white : 
    {
      background: 'bg-white',
      badgeBg: 'bg-black/10',
      badgeText: 'text-black',
      badgeBorder: 'border-black/20',
      headingText: 'text-black',
      descriptionText: 'text-black/80',
      cardBg: 'bg-[#C61E1E]/90',
      cardBorder: 'border-[#C61E1E]/90',
      cardHoverBg: 'hover:bg-[#C61E1E]',
      cardHoverBorder: 'hover:border-[#C61E1E]',
      iconDefault: 'text-white',
      iconHover: 'group-hover:text-white',
      iconActive: 'text-white',
      titleDefault: 'text-white',
      titleHover: 'group-hover:hidden',
      textDefault: 'text-white',
      bulletColor: 'text-white',
      activeCardBg: 'bg-[#C61E1E]',
      activeCardBorder: 'border-[#C61E1E]',
      buttonBg: 'bg-white',
      buttonText: 'text-[#C61E1E]',
      buttonBorder: 'border-white',
      buttonHoverBg: 'group-hover:bg-gray-100',
      buttonHoverText: 'group-hover:text-[#C61E1E]',
      buttonHoverBorder: 'group-hover:border-gray-100',
      buttonActiveBg: 'bg-gray-100',
      buttonActiveBorder: 'border-gray-100',
      buttonActiveText: 'text-[#C61E1E]'
    }
  };

  const t = themes[theme];

  return (
    <div className={`w-full py-12 lg:py-20 ${t.background}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 lg:gap-10">
          <div className="flex gap-3 lg:gap-4 flex-col items-start">
            <div className="flex gap-2 flex-col">
              <h2 className={`text-2xl md:text-3xl lg:text-5xl tracking-tighter max-w-xl font-regular text-left ${t.headingText}`}>
                Ekiplerimiz
              </h2>
              <p className={`text-base md:text-lg lg:max-w-6xl max-w-lg leading-relaxed tracking-tight ${t.descriptionText} text-left`}>
                Turkish Club&apos;ın arkasındaki tutkulu ekiplerle tanışın. Her biri size en iyi içerik, etkinlik ve dijital deneyimler sunmaya adanmış.
              </p>
            </div>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"
            onClick={() => setActiveCard(null)}
          >
            {/* Software Team */}
            <div 
              className={`group backdrop-blur-sm border rounded-lg p-4 lg:p-6 flex flex-col min-h-[200px] lg:min-h-[250px] transition-all duration-700 ${t.cardHoverBg} ${t.cardHoverBorder} ${hoverScaleFor(0)} transform-gpu cursor-pointer overflow-hidden relative ${activeCard === 0 ? `${t.activeCardBg} ${t.activeCardBorder} scale-105 z-10` : `${t.cardBg} ${t.cardBorder} z-0`}`}
              onClick={(e) => { e.stopPropagation(); setActiveCard(activeCard === 0 ? null : 0); }}
            >
              <div className="flex flex-col gap-2">
                <Code className={`w-6 h-6 lg:w-8 lg:h-8 stroke-1 transition-all duration-700 group-hover:scale-110 ${activeCard === 0 ? `${t.iconActive} scale-110` : `${t.iconDefault} ${t.iconHover}`}`} />
                <div className="flex flex-col gap-1 lg:gap-2">
                <h3 className={`text-lg lg:text-xl tracking-tight transition-all duration-700 ${activeCard === 0 ? 'hidden' : `${t.titleDefault} ${t.titleHover}`}`}>Yazılım Ekibi</h3>
                <p className={`${t.textDefault} text-xs lg:text-sm transition-all duration-700 ${activeCard === 0 ? 'hidden' : 'group-hover:hidden'}`}>
                  Yenilikçi dijital çözümler geliştiriyor ve platformlarımızı en son teknoloji ile sürdürüyoruz.
                </p>
                <ul className={`${t.bulletColor} text-sm lg:text-base list-disc list-inside space-y-2 transition-all duration-700 ${activeCard === 0 ? 'block' : 'hidden group-hover:block'}`}>
                  <li>Web & Mobil Geliştirme</li>
                  <li>Platform Bakım & Destek</li>
                  <li>Veritabanı Yönetimi</li>
                  <li>API Entegrasyon & Geliştirme</li>
                </ul>
                </div>
              </div>

              <div
                className={`mt-auto flex justify-end transition-all duration-300 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto ${activeCard === 0 ? 'opacity-100 translate-y-0 pointer-events-auto' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  asChild
                  size="sm"
                  className={`${t.buttonBg} ${t.buttonText} ${t.buttonBorder} ${t.buttonHoverBg} ${t.buttonHoverText} ${t.buttonHoverBorder} ${activeCard === 0 ? `${t.buttonActiveBg} ${t.buttonActiveBorder} ${t.buttonActiveText}` : ''}`}
                >
                  <a href="https://forms.gle/yKSR7oey5Ju8d75j6" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); }}>
                    Daha Fazla
                  </a>
                </Button>
              </div>
            </div>

            {/* Content Team */}
            <div 
              className={`group backdrop-blur-sm border rounded-lg p-4 lg:p-6 flex flex-col min-h-[200px] lg:min-h-[250px] transition-all duration-700 ${t.cardHoverBg} ${t.cardHoverBorder} ${hoverScaleFor(1)} transform-gpu cursor-pointer overflow-hidden relative ${activeCard === 1 ? `${t.activeCardBg} ${t.activeCardBorder} scale-105 z-10` : `${t.cardBg} ${t.cardBorder} z-0`}`}
              onClick={(e) => { e.stopPropagation(); setActiveCard(activeCard === 1 ? null : 1); }}
            >
              <div className="flex flex-col gap-2">
                <PenTool className={`w-6 h-6 lg:w-8 lg:h-8 stroke-1 transition-all duration-700 group-hover:scale-110 ${activeCard === 1 ? `${t.iconActive} scale-110` : `${t.iconDefault} ${t.iconHover}`}`} />
                <div className="flex flex-col gap-1 lg:gap-2">
                <h3 className={`text-lg lg:text-xl tracking-tight transition-all duration-700 ${activeCard === 1 ? 'hidden' : `${t.titleDefault} ${t.titleHover}`}`}>İçerik Ekibi</h3>
                <p className={`${t.textDefault} text-xs lg:text-sm transition-all duration-700 ${activeCard === 1 ? 'hidden' : 'group-hover:hidden'}`}>
                  Türk topluluğumuzu birbirine bağlayan ilgi çekici hikayeler, makaleler ve blog yazıları oluşturuyoruz.
                </p>
                <ul className={`${t.bulletColor} text-sm lg:text-base list-disc list-inside space-y-2 transition-all duration-700 ${activeCard === 1 ? 'block' : 'hidden group-hover:block'}`}>
                  <li>Blog Yazarlığı & Makaleler</li>
                  <li>Sosyal Medya İçerik Üretimi</li>
                  <li>Bülten & E-posta Kampanyaları</li>
                  <li>Topluluk Hikayeleri & Röportajlar</li>
                </ul>
                </div>
              </div>

              <div
                className={`mt-auto flex justify-end transition-all duration-300 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto ${activeCard === 1 ? 'opacity-100 translate-y-0 pointer-events-auto' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  asChild
                  size="sm"
                  className={`${t.buttonBg} ${t.buttonText} ${t.buttonBorder} ${t.buttonHoverBg} ${t.buttonHoverText} ${t.buttonHoverBorder} ${activeCard === 1 ? `${t.buttonActiveBg} ${t.buttonActiveBorder} ${t.buttonActiveText}` : ''}`}
                >
                  <a href="https://forms.gle/yKSR7oey5Ju8d75j6" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); }}>
                    Daha Fazla
                  </a>
                </Button>
              </div>
            </div>

            {/* Social Media Team */}
            <div 
              className={`group backdrop-blur-sm border rounded-lg p-4 lg:p-6 flex flex-col min-h-[200px] lg:min-h-[250px] transition-all duration-700 ${t.cardHoverBg} ${t.cardHoverBorder} ${hoverScaleFor(2)} transform-gpu cursor-pointer overflow-hidden relative ${activeCard === 2 ? `${t.activeCardBg} ${t.activeCardBorder} scale-105 z-10` : `${t.cardBg} ${t.cardBorder} z-0`}`}
              onClick={(e) => { e.stopPropagation(); setActiveCard(activeCard === 2 ? null : 2); }}
            >
              <div className="flex flex-col gap-2">
                <Users className={`w-6 h-6 lg:w-8 lg:h-8 stroke-1 transition-all duration-700 group-hover:scale-110 ${activeCard === 2 ? `${t.iconActive} scale-110` : `${t.iconDefault} ${t.iconHover}`}`} />
                <div className="flex flex-col gap-1 lg:gap-2">
                <h3 className={`text-lg lg:text-xl tracking-tight transition-all duration-700 ${activeCard === 2 ? 'hidden' : `${t.titleDefault} ${t.titleHover}`}`}>Sosyal Medya & Tasarım Ekibi</h3>
                <p className={`${t.textDefault} text-xs lg:text-sm transition-all duration-700 ${activeCard === 2 ? 'hidden' : 'group-hover:hidden'}`}>
                  Online varlığımızı yönetiyor ve markamızı temsil eden muhteşem görsel içerikler yaratıyoruz.
                </p>
                <ul className={`${t.bulletColor} text-sm lg:text-base list-disc list-inside space-y-2 transition-all duration-700 ${activeCard === 2 ? 'block' : 'hidden group-hover:block'}`}>
                  <li>Grafik Tasarım & Marka Kimliği</li>
                  <li>Sosyal Medya Yönetimi</li>
                  <li>Video & Fotoğraf Düzenleme</li>
                  <li>Pazarlama Kampanya Tasarımı</li>
                </ul>
                </div>
              </div>

              <div
                className={`mt-auto flex justify-end transition-all duration-300 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto ${activeCard === 2 ? 'opacity-100 translate-y-0 pointer-events-auto' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  asChild
                  size="sm"
                  className={`${t.buttonBg} ${t.buttonText} ${t.buttonBorder} ${t.buttonHoverBg} ${t.buttonHoverText} ${t.buttonHoverBorder} ${activeCard === 2 ? `${t.buttonActiveBg} ${t.buttonActiveBorder} ${t.buttonActiveText}` : ''}`}
                >
                  <a href="https://forms.gle/yKSR7oey5Ju8d75j6" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); }}>
                    Daha Fazla
                  </a>
                </Button>
              </div>
            </div>

            {/* Events Team */}
            <div 
              className={`group backdrop-blur-sm border rounded-lg p-4 lg:p-6 flex flex-col min-h-[200px] lg:min-h-[250px] transition-all duration-700 ${t.cardHoverBg} ${t.cardHoverBorder} ${hoverScaleFor(3)} transform-gpu cursor-pointer overflow-hidden relative ${activeCard === 3 ? `${t.activeCardBg} ${t.activeCardBorder} scale-105 z-10` : `${t.cardBg} ${t.cardBorder} z-0`}`}
              onClick={(e) => { e.stopPropagation(); setActiveCard(activeCard === 3 ? null : 3); }}
            >
              <div className="flex flex-col gap-2">
                <Calendar className={`w-6 h-6 lg:w-8 lg:h-8 stroke-1 transition-all duration-700 group-hover:scale-110 ${activeCard === 3 ? `${t.iconActive} scale-110` : `${t.iconDefault} ${t.iconHover}`}`} />
                <div className="flex flex-col gap-1 lg:gap-2">
                <h3 className={`text-lg lg:text-xl tracking-tight transition-all duration-700 ${activeCard === 3 ? 'hidden' : `${t.titleDefault} ${t.titleHover}`}`}>Etkinlik Ekibi</h3>
                <p className={`${t.textDefault} text-xs lg:text-sm transition-all duration-700 ${activeCard === 3 ? 'hidden' : 'group-hover:hidden'}`}>
                  Bizi bir araya getiren unutulmaz buluşmalar, kültürel kutlamalar ve topluluk etkinlikleri düzenliyoruz.
                </p>
                <ul className={`${t.bulletColor} text-sm lg:text-base list-disc list-inside space-y-2 transition-all duration-700 ${activeCard === 3 ? 'block' : 'hidden group-hover:block'}`}>
                  <li>Etkinlik Planlama & Koordinasyon</li>
                  <li>Kültürel Kutlamalar & Festivaller</li>
                  <li>Mekan & Lojistik Yönetimi</li>
                  <li>Topluluk Buluşmaları & Networkİng</li>
                </ul>
                </div>
              </div>

              <div
                className={`mt-auto flex justify-end transition-all duration-300 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto ${activeCard === 3 ? 'opacity-100 translate-y-0 pointer-events-auto' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  asChild
                  size="sm"
                  className={`${t.buttonBg} ${t.buttonText} ${t.buttonBorder} ${t.buttonHoverBg} ${t.buttonHoverText} ${t.buttonHoverBorder} ${activeCard === 3 ? `${t.buttonActiveBg} ${t.buttonActiveBorder} ${t.buttonActiveText}` : ''}`}
                >
                  <a href="https://forms.gle/yKSR7oey5Ju8d75j6" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); }}>
                    Daha Fazla
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
