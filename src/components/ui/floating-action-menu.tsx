'use client';

import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {Users, Instagram, Calendar, MessageCircle} from 'lucide-react';
import {Analytics} from '@/lib/analytics';

type FloatingActionMenuOption = {
  label: string;
  onClick?: () => void;
  Icon?: React.ReactNode;
};

type FloatingActionMenuProps = {
  options?: FloatingActionMenuOption[];
  className?: string;
};

const FloatingActionMenu = ({options, className}: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLabel, setButtonLabel] = useState<string>('Bize Katıl!');

  const toggleMenu = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    setButtonLabel(nextOpen ? 'Hoşgeldin' : 'Bize Katıl!');

    // Track floating menu interaction
    Analytics.trackNavigation({
      action: 'floating_menu',
      menu_section: nextOpen ? 'open' : 'close',
      destination: nextOpen ? 'menu_opened' : 'menu_closed'
    });
  };

  const defaultOptions: FloatingActionMenuOption[] = [
    {
      label: 'Takıma Katıl!',
      Icon: <Users className="w-4 h-4 text-black" />,
      onClick: () => {
        setIsOpen(false);
        window.location.href = '/team';
      }
    },
    {
      label: 'WhatsApp',
      Icon: <MessageCircle className="w-4 h-4 text-green-500" />,
      onClick: () => {
        setIsOpen(false);
        window.open(
          'https://chat.whatsapp.com/LHzs06mN7iCG2cXlZHpZs9',
          '_blank'
        );
      }
    },
    {
      label: 'Instagram',
      Icon: <Instagram className="w-4 h-4 text-pink-500" />,
      onClick: () => {
        setIsOpen(false);
        window.open('https://www.instagram.com/turkishclub.munich/', '_blank');
      }
    },
    {
      label: 'Etkinlikler',
      Icon: <Calendar className="w-4 h-4 text-red-500" />,
      onClick: () => {
        setIsOpen(false);
        window.open('https://lu.ma/user/turkishclub', '_blank');
      }
    }
  ];

  const usedOptions: Required<FloatingActionMenuOption[]> = (
    options ?? defaultOptions
  ).map((opt) => ({
    ...opt,
    onClick: () => {
      opt.onClick?.();
      setIsOpen(false);
    }
  }));

  return (
    <div className={cn('relative w-full flex justify-center', className)}>
      <Button
        onClick={toggleMenu}
        className="w-24 h-10 bg-black hover:bg-[#111111d1] shadow-[0_0_20px_rgba(0,0,0,0.2)] "
        aria-expanded={isOpen}
        aria-label={buttonLabel}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={buttonLabel}
            initial={{opacity: 0, y: 6}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.2, ease: 'easeOut'}}
            className="inline-block"
          >
            {buttonLabel}
          </motion.span>
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0, y: -8, filter: 'blur(8px)'}}
            animate={{opacity: 1, y: 0, filter: 'blur(0px)'}}
            exit={{opacity: 0, y: -8, filter: 'blur(8px)'}}
            transition={{
              duration: 0.6,
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.1
            }}
            className="absolute left-1/2 top-full -translate-x-1/2 mt-2 z-50"
          >
            <div className="flex flex-col items-center gap-2">
              {usedOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{opacity: 0, x: 20}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0, x: 20}}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05
                  }}
                >
                  <Button
                    onClick={option.onClick}
                    size="sm"
                    className="flex items-center justify-center gap-2 w-28 text-black bg-white hover:bg-gray-50 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none rounded-xl backdrop-blur-sm"
                  >
                    {option.Icon}
                    <span>{option.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;
