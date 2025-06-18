// filepath: /Users/inanccan/turkish-club-website/website/src/components/LocaleSwitcher.tsx
import {useLocale, useTranslations} from 'next-intl';
import {routing} from '@/i18n/routing';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  const options = routing.locales.map((cur) => ({
    value: cur,
    label: t('locale', {locale: cur})
  }));

  return (
    <LocaleSwitcherSelect 
      defaultValue={locale} 
      label={t('label')}
      options={options}
    />
  );
}