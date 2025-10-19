'use client';
import React, {useState, useEffect, useMemo} from 'react';
import {Button} from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {Feature} from '@/components/ui/feature-section-with-bento-grid';
import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';



const AnimatedHero = () => {
  const t = useTranslations('team');
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      t('hero.animate.code'),
      t('hero.animate.blog'),
      t('hero.animate.design')
    ],
    [t]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <motion.div
      className="w-full bg-gradient-to-br bg-[#C61E1E] text-white"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.8}}
    >
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col relative overflow-hidden">
          {/* Animated background elements */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-16 h-16 bg-white opacity-10 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          <motion.div
            className="flex gap-4 flex-col"
            initial={{y: 50, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{duration: 0.8, delay: 0.2}}
          >
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-regular">
              <span className="text-white">{t('hero.title.prefix')}</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-white"
                    initial={{opacity: 0, y: '-100'}}
                    transition={{type: 'spring', stiffness: 50}}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.p
              className="text-lg md:text-xl leading-relaxed tracking-tight text-white/90 max-w-3xl text-center"
              initial={{y: 30, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              transition={{duration: 0.8, delay: 0.4}}
            >
              {t('hero.description')}
            </motion.p>
          </motion.div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.open('https://forms.gle/yKSR7oey5Ju8d75j6', '_blank', 'noopener,noreferrer')}
            className="bg-white text-[#C61E1E] hover:bg-gray-100 border-white hover:border-gray-100"
          >
              Bize Katıl
     
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default function TeamPageClient() {
  return (
    <div className="bg-[#C61E1E] min-h-screen text-white">
      <Navbar />
      <AnimatedHero />
      <Feature />
      <Footer />
    </div>
  );
}
