'use client';

import {Locale} from 'next-intl';
import {useTransition, useState, useRef, useEffect} from 'react';
import {usePathname, useRouter} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {ChevronDown, Check} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';

type Props = {
  defaultValue: string;
  label: string;
  options: Array<{value: string; label: string}>;
  triggerClassName?: string;  
  contentClassName?: string;   
  itemClassName?: string;        
};

export default function LocaleSwitcherSelect({
  defaultValue,
  label,
  options,
  triggerClassName,
  contentClassName,
  itemClassName
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find(opt => opt.value === defaultValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function onValueChange(value: string) {
    const nextLocale = value as Locale;
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={cn(
          "bg-transparent hover:bg-white/10 rounded-md px-4 py-2 flex items-center gap-1",
          triggerClassName
        )}
      >
        {selectedOption?.label}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn("absolute top-full right-0 mt-2 z-50", contentClassName)}
          >
            <div className="flex flex-col items-center gap-2">
              {options.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => onValueChange(option.value)}
                    className={cn(
                      "flex items-center justify-start gap-3 w-40 h-auto text-black bg-white hover:bg-gray-50 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none rounded-xl py-3 px-5",
                      defaultValue === option.value && "bg-gray-100",
                      itemClassName
                    )}
                  >
                    <span className="font-medium text-sm">{option.label}</span>
                    {defaultValue === option.value && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
