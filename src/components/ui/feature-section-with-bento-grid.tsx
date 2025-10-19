import { Code, PenTool, Users, Calendar, Heart, Target, Lightbulb, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function Feature() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const hoverScaleFor = (i: number) =>
    activeCard === null || activeCard === i ? 'hover:scale-105' : '';

  return (
    <div className="w-full py-12 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 lg:gap-10">
          {/* Values Section */}
          <div className="flex gap-3 lg:gap-4 flex-col items-start">
            <div className="flex gap-2 flex-col">
              <h2 className="text-2xl md:text-3xl lg:text-5xl tracking-tighter max-w-xl font-regular text-left text-black">
                Değerlerimiz
              </h2>
              <p className="text-base md:text-lg lg:max-w-6xl max-w-lg leading-relaxed tracking-tight text-black/80 text-left">
                Turkish Club olarak bizi bir arada tutan ve çalışmalarımıza yön veren temel değerlerimiz.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Önce Tavır */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 flex flex-col gap-3">
              <Heart className="w-6 h-6 lg:w-8 lg:h-8 stroke-1 text-[#C61E1E]" />
              <div className="flex flex-col gap-2">
                <h3 className="text-lg lg:text-xl tracking-tight text-black font-medium">
                  Önce Tavır
                </h3>
                <p className="text-black/80 text-sm lg:text-base leading-relaxed">
                  Ekibimize katılırken karakter ve tutumu her şeyden önce değerlendiririz.
                </p>
              </div>
            </div>

            {/* Yüksek Sorumluluk ve Güven */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 flex flex-col gap-3">
              <Target className="w-6 h-6 lg:w-8 lg:h-8 stroke-1 text-[#C61E1E]" />
              <div className="flex flex-col gap-2">
                <h3 className="text-lg lg:text-xl tracking-tight text-black font-medium">
                  Yüksek Sorumluluk ve Güven
                </h3>
                <p className="text-black/80 text-sm lg:text-base leading-relaxed">
                  Görevlerinin sahipliğini alan ve güvenilir ekip arkadaşları arıyoruz.
                </p>
              </div>
            </div>

            {/* İlk Adımı Sen At */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 flex flex-col gap-3">
              <Lightbulb className="w-6 h-6 lg:w-8 lg:h-8 stroke-1 text-[#C61E1E]" />
              <div className="flex flex-col gap-2">
                <h3 className="text-lg lg:text-xl tracking-tight text-black font-medium">
                  İlk Adımı Sen At
                </h3>
                <p className="text-black/80 text-sm lg:text-base leading-relaxed">
                  İlham aldıkları bir projeyi hayata geçirmek için inisiyatif alan kişiler istiyoruz.
                </p>
              </div>
            </div>

            {/* Daha İyisini Hedefle */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 flex flex-col gap-3">
              <Handshake className="w-6 h-6 lg:w-8 lg:h-8 stroke-1 text-[#C61E1E]" />
              <div className="flex flex-col gap-2">
                <h3 className="text-lg lg:text-xl tracking-tight text-black font-medium">
                  Daha İyisini Hedefle
                </h3>
                <p className="text-black/80 text-sm lg:text-base leading-relaxed">
                  Kendilerini ve işlerinin kalitesini geliştirmek isteyen, geri bildirimlere ve işbirliğine açık kişiler bekliyoruz.
                </p>
              </div>
            </div>
          </div>

          {/* Teams Section */}
          <div className="flex gap-3 lg:gap-4 flex-col items-start mt-12 lg:mt-16">
            <div className="flex gap-2 flex-col">
              <h2 className="text-2xl md:text-3xl lg:text-5xl tracking-tighter max-w-xl font-regular text-left text-black">
                Ekiplerimiz
              </h2>
              <p className="text-base md:text-lg lg:max-w-6xl max-w-lg leading-relaxed tracking-tight text-black/80 text-left">
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
              className={`group bg-white border border-gray-200 rounded-lg p-4 lg:p-6 flex flex-col justify-between min-h-[200px] lg:min-h-[250px] transition-all duration-700 lg:hover:bg-[#C61E1E] lg:hover:border-[#C61E1E] ${hoverScaleFor(0)} transform-gpu cursor-pointer overflow-hidden relative ${activeCard === 0 ? 'bg-[#C61E1E] border-[#C61E1E] scale-105 z-10' : 'z-0'}`}
              onClick={(e) => { e.stopPropagation(); setActiveCard(activeCard === 0 ? null : 0); }}
            >
              <div className="flex flex-col gap-2">
                <Code className={`w-6 h-6 lg:w-8 lg:h-8 stroke-1 text-black lg:group-hover:text-white transition-all duration-700 lg:group-hover:scale-110 ${activeCard === 0 ? 'scale-110 text-white' : ''}`} />
              </div>

              <div className="flex flex-col gap-1 lg:gap-2 flex-1 justify-center">
                <h3 className={`text-lg lg:text-xl tracking-tight text-black lg:group-hover:text-white transition-all duration-700 ${activeCard === 0 ? 'hidden' : 'lg:group-hover:hidden'}`}>Yazılım Ekibi</h3>
                <p className={`text-black/80 lg:group-hover:text-white text-xs lg:text-sm transition-all duration-700 ${activeCard === 0 ? 'hidden' : 'lg:group-hover:hidden'}`}>
                  Yenilikçi dijital çözümler geliştiriyor ve platformlarımızı en son teknoloji ile sürdürüyoruz.
                </p>
                <ul className={`text-white text-xs lg:text-base list-disc list-inside space-y-2 transition-all duration-700 ${activeCard === 0 ? 'block' : 'hidden lg:group-hover:block'}`}>
                  <li>Web Sitesini Geliştirme</li>
                  <li>İçerik Alt Yapısı</li>
                </ul>
              </div>

              <div
                className={`flex justify-end transition-all duration-300 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto ${activeCard === 0 ? 'opacity-100 translate-y-0 pointer-events-auto' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  asChild
                  size="sm"
                  className={`bg-white text-[#C61E1E] border-white group-hover:bg-gray-100 group-hover:text-[#C61E1E] group-hover:border-gray-100 ${activeCard === 0 ? 'bg-gray-100 border-gray-100 text-[#C61E1E]' : ''}`}
                >
                  <a href="https://forms.gle/yKSR7oey5Ju8d75j6" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); }}>
                    Başvuru Yap
                  </a>
                </Button>
              </div>
            </div>

            {/* Content Team */}
            <div 
              className={`group bg-white border border-gray-200 rounded-lg p-4 lg:p-6 flex flex-col justify-between min-h-[200px] lg:min-h-[250px] transition-all duration-700 lg:hover:bg-[#C61E1E] lg:hover:border-[#C61E1E] ${hoverScaleFor(1)} transform-gpu cursor-pointer overflow-hidden relative ${activeCard === 1 ? 'bg-[#C61E1E] border-[#C61E1E] scale-105 z-10' : 'z-0'}`}
              onClick={(e) => { e.stopPropagation(); setActiveCard(activeCard === 1 ? null : 1); }}
            >
              <div className="flex flex-col gap-2">
                <PenTool className={`w-6 h-6 lg:w-8 lg:h-8 stroke-1 text-black lg:group-hover:text-white transition-all duration-700 lg:group-hover:scale-110 ${activeCard === 1 ? 'scale-110 text-white' : ''}`} />
              </div>

              <div className="flex flex-col gap-1 lg:gap-2 flex-1 justify-center">
                <h3 className={`text-lg lg:text-xl tracking-tight text-black lg:group-hover:text-white transition-all duration-700 ${activeCard === 1 ? 'hidden' : 'lg:group-hover:hidden'}`}>İçerik Ekibi</h3>
                <p className={`text-black/80 lg:group-hover:text-white text-xs lg:text-sm transition-all duration-700 ${activeCard === 1 ? 'hidden' : 'lg:group-hover:hidden'}`}>
                  Türk topluluğumuzu birbirine bağlayan ilgi çekici hikayeler, makaleler ve blog yazıları oluşturuyoruz.
                </p>
                <ul className={`text-white text-xs lg:text-base list-disc list-inside space-y-2 transition-all duration-700 ${activeCard === 1 ? 'block' : 'hidden lg:group-hover:block'}`}>
                  <li>Blog Yazarlığı ve Editörlük</li>
                  <li>Konu Araştırması</li>
                  <li>İçerik Planlama</li>
                </ul>
              </div>

              <div
                className={`flex justify-end transition-all duration-300 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto ${activeCard === 1 ? 'opacity-100 translate-y-0 pointer-events-auto' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  asChild
                  size="sm"
                  className={`bg-white text-[#C61E1E] border-white group-hover:bg-gray-100 group-hover:text-[#C61E1E] group-hover:border-gray-100 ${activeCard === 1 ? 'bg-gray-100 border-gray-100 text-[#C61E1E]' : ''}`}
                >
                  <a href="https://forms.gle/yKSR7oey5Ju8d75j6" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); }}>
                    Başvuru Yap
                  </a>
                </Button>
              </div>
            </div>

            {/* Social Media Team */}
            <div 
              className={`group bg-white border border-gray-200 rounded-lg p-4 lg:p-6 flex flex-col justify-between min-h-[200px] lg:min-h-[250px] transition-all duration-700 lg:hover:bg-[#C61E1E] lg:hover:border-[#C61E1E] ${hoverScaleFor(2)} transform-gpu cursor-pointer overflow-hidden relative ${activeCard === 2 ? 'bg-[#C61E1E] border-[#C61E1E] scale-105 z-10' : 'z-0'}`}
              onClick={(e) => { e.stopPropagation(); setActiveCard(activeCard === 2 ? null : 2); }}
            >
              <div className="flex flex-col gap-2">
                <Users className={`w-6 h-6 lg:w-8 lg:h-8 stroke-1 text-black lg:group-hover:text-white transition-all duration-700 lg:group-hover:scale-110 ${activeCard === 2 ? 'scale-110 text-white' : ''}`} />
              </div>

              <div className="flex flex-col gap-1 lg:gap-2 flex-1 justify-center">
                <h3 className={`text-lg lg:text-xl tracking-tight text-black lg:group-hover:text-white transition-all duration-700 ${activeCard === 2 ? 'hidden' : 'lg:group-hover:hidden'}`}>Sosyal Medya & Tasarım Ekibi</h3>
                <p className={`text-black/80 lg:group-hover:text-white text-xs lg:text-sm transition-all duration-700 ${activeCard === 2 ? 'hidden' : 'lg:group-hover:hidden'}`}>
                  Online varlığımızı yönetiyor ve markamızı temsil eden muhteşem görsel içerikler yaratıyoruz.
                </p>
                <ul className={`text-white text-xs lg:text-base list-disc list-inside space-y-2 transition-all duration-700 ${activeCard === 2 ? 'block' : 'hidden lg:group-hover:block'}`}>
                  <li>Grafik Tasarım & Marka Kimliği</li>
                  <li>Sosyal Medya Yönetimi</li>
                  <li>Video & Fotoğraf Düzenleme</li>
                </ul>
              </div>

              <div
                className={`flex justify-end transition-all duration-300 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto ${activeCard === 2 ? 'opacity-100 translate-y-0 pointer-events-auto' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  asChild
                  size="sm"
                  className={`bg-white text-[#C61E1E] border-white group-hover:bg-gray-100 group-hover:text-[#C61E1E] group-hover:border-gray-100 ${activeCard === 2 ? 'bg-gray-100 border-gray-100 text-[#C61E1E]' : ''}`}
                >
                  <a href="https://forms.gle/yKSR7oey5Ju8d75j6" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); }}>
                    Başvuru Yap
                  </a>
                </Button>
              </div>
            </div>

            {/* Events Team */}
            <div 
              className={`group bg-white border border-gray-200 rounded-lg p-4 lg:p-6 flex flex-col justify-between min-h-[200px] lg:min-h-[250px] transition-all duration-700 lg:hover:bg-[#C61E1E] lg:hover:border-[#C61E1E] ${hoverScaleFor(3)} transform-gpu cursor-pointer overflow-hidden relative ${activeCard === 3 ? 'bg-[#C61E1E] border-[#C61E1E] scale-105 z-10' : 'z-0'}`}
              onClick={(e) => { e.stopPropagation(); setActiveCard(activeCard === 3 ? null : 3); }}
            >
              <div className="flex flex-col gap-2">
                <Calendar className={`w-6 h-6 lg:w-8 lg:h-8 stroke-1 text-black lg:group-hover:text-white transition-all duration-700 lg:group-hover:scale-110 ${activeCard === 3 ? 'scale-110 text-white' : ''}`} />
              </div>

              <div className="flex flex-col gap-1 lg:gap-2 flex-1 justify-center">
                <h3 className={`text-lg lg:text-xl tracking-tight text-black lg:group-hover:text-white transition-all duration-700 ${activeCard === 3 ? 'hidden' : 'lg:group-hover:hidden'}`}>Etkinlik Ekibi</h3>
                <p className={`text-black/80 lg:group-hover:text-white text-xs lg:text-sm transition-all duration-700 ${activeCard === 3 ? 'hidden' : 'lg:group-hover:hidden'}`}>
                  Bizi bir araya getiren unutulmaz buluşmalar, kültürel kutlamalar ve topluluk etkinlikleri düzenliyoruz.
                </p>
                <ul className={`text-white text-xs lg:text-base list-disc list-inside space-y-2 transition-all duration-700 ${activeCard === 3 ? 'block' : 'hidden lg:group-hover:block'}`}>
                  <li>Etkinlik Planlama & Koordinasyon</li>
                  <li>Mekan & Lojistik Yönetimi</li>
                  <li>Topluluk Buluşmaları & Networking</li>
                </ul>
              </div>

              <div
                className={`flex justify-end transition-all duration-300 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto ${activeCard === 3 ? 'opacity-100 translate-y-0 pointer-events-auto' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  asChild
                  size="sm"
                  className={`bg-white text-[#C61E1E] border-white group-hover:bg-gray-100 group-hover:text-[#C61E1E] group-hover:border-gray-100 ${activeCard === 3 ? 'bg-gray-100 border-gray-100 text-[#C61E1E]' : ''}`}
                >
                  <a href="https://forms.gle/yKSR7oey5Ju8d75j6" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); }}>
                    Başvuru Yap
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
