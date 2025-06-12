"use client";
import React from "react";
import Link from "next/link";
import LocaleSwitcher from "./LocaleSwitcher";
import {useTranslations} from 'next-intl';

export default function Navbar() {
  const t = useTranslations('Navbar');

  return (
      <header className="flex justify-between items-center p-4 bg-[#C61E1E]">
        <div className="text-white font-bold text-xl">Turkish Club</div>
        <div className="flex gap-4 justify-center items-center">
          <Link href="https://www.instagram.com/turkishclub.munich/" className="text-white hover:underline">
            Instagram
          </Link>
          <Link href="https://forms.gle/zvAT7iFKN8PzR5Gb7" className="text-white hover:underline">
           {t('joinTeam')}
          </Link>
          <LocaleSwitcher />
        </div>
      </header>
  )
}
