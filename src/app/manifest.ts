import {MetadataRoute} from 'next';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';


// This is the manifest file for the application.
// It provides metadata about the application, such as its name, start URL, and theme color.
// The translations are fetched using the `getTranslations` function from the `next-intl` package.
// The `routing` module is used to get the default locale for the application.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: 'Manifest'
  });

  return {
    name: t('name'), 
    start_url: '/',
    theme_color: '#C61E1E'
  };// returns the manifest object with the specified properties
}
