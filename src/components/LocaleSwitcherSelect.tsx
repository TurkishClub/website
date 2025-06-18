'use client';

import {useParams} from 'next/navigation';
import {Locale} from 'next-intl';
import {useTransition} from 'react';
import {usePathname, useRouter} from '@/i18n/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const params = useParams();

  function onValueChange(value: string) {
    const nextLocale = value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  }

  return (
    <div className={isPending ? 'opacity-30 transition-opacity' : ''}>
      <Select
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-auto bg-transparent border-none text-gray-100 font-bold">
          <SelectValue aria-label={label} />
        </SelectTrigger>
        <SelectContent>
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