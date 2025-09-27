'use client';

import {Locale} from 'next-intl';
import {useTransition} from 'react';
import {usePathname, useRouter} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

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

  function onValueChange(value: string) {
    const nextLocale = value as Locale;
    startTransition(() => {
      router.replace({pathname}, {locale: nextLocale});
    });
  }

  return (
    <div>
      <Select defaultValue={defaultValue} onValueChange={onValueChange} disabled={isPending}>
        <SelectTrigger
          className={cn(
            "w-auto bg-transparent border-none font-medium text-sm shadow-none focus:ring-0",
            triggerClassName
          )}
        >
          <SelectValue aria-label={label} />
        </SelectTrigger>
        <SelectContent className={cn("shadow-none border-none", contentClassName)}>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={itemClassName}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
