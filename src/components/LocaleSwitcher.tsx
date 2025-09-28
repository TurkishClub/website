import {useLocale, useTranslations} from 'next-intl';
import {routing} from '@/i18n/routing';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

type SwitcherProps = {
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
};


export default function LocaleSwitcher(props: SwitcherProps) {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const options = routing.locales.map((cur) => ({
    value: cur,
    label: t('locale', { locale: cur })
  }));

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      label={t('label')}
      options={options}
      {...props}
    />
  );
}
