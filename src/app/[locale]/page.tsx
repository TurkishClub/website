import {Locale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {use} from 'react';
import HomePage from '@/components/HomePage';
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;


type Props = {
  params: Promise<{locale: Locale}>;
};

export default function IndexPage({params}: Props) {
  const {locale} = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  return <HomePage />;
}