'use client';
import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Button} from '@/components/ui/button';

interface AnimatedHeroProps {
  titlePrefix: string;
  animatedTitles: string[];
  description: string;
  buttonText?: string;
  buttonLink?: string;
  onButtonClick?: () => void;
}

export default function AnimatedHero({
  titlePrefix,
  animatedTitles,
  description,
  buttonText,
  buttonLink,
  onButtonClick
}: AnimatedHeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === animatedTitles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, animatedTitles.length]);

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonLink) {
      window.location.href = buttonLink;
    }
  };

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
              <span className="text-white">{titlePrefix}</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {animatedTitles.map((title, index) => (
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
              {description}
            </motion.p>
          </motion.div>

          {buttonText && (
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-[#C61E1E] hover:bg-gray-100 border-white hover:border-gray-100"
              onClick={handleButtonClick}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
