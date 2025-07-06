import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
// This module exports a function that retrieves the request configuration for internationalization.
// It checks the requested locale against the available locales and returns the appropriate messages.
export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
