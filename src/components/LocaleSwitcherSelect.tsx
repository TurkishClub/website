'use client';

import {Locale} from 'next-intl';
import {useTransition} from 'react';
import {usePathname, useRouter} from '@/i18n/navigation';
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
};

export default function LocaleSwitcherSelect({
  defaultValue,
  label,
  options
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
      <Select
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-auto bg-transparent border-none font-medium text-sm shadow-none focus:ring-0">
          <SelectValue aria-label={label} />
        </SelectTrigger>
        <SelectContent className="shadow-none border-none">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
