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
          "bg-transparent hover:bg-white/10 rounded-md px-4 py-2 flex items-center gap-1 transition-[background-color,color,transform] duration-160 ease-out-strong active:scale-[0.97]",
          triggerClassName
        )}
      >
        {selectedOption?.label}
        <ChevronDown
          className={cn('w-4 h-4 transition-transform duration-200 ease-out-strong', isOpen && 'rotate-180')}
        />
      </Button>
      <AnimatePresence>
        {isOpen && (
          // One piece, scaling from the trigger corner. Full transform strings keep it
          // off the main thread on framer-motion < 14.2.
          <motion.div
            initial={{ opacity: 0, transform: 'translateY(-4px) scale(0.97)' }}
            animate={{
              opacity: 1,
              transform: 'translateY(0px) scale(1)',
              transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] }
            }}
            exit={{
              opacity: 0,
              transform: 'translateY(-4px) scale(0.97)',
              transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] }
            }}
            className={cn("absolute top-full right-0 mt-2 z-50 origin-top-right", contentClassName)}
          >
            <div className="flex flex-col items-center gap-2">
              {options.map((option) => (
                <div key={option.value}>
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
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
