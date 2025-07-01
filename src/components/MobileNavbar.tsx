"use client"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { JSX, SVGProps } from "react"
import LocaleSwitcher from "./LocaleSwitcher"
import { useTranslations } from 'next-intl';
import { Instagram, Github, MessageCircle, Search, BookOpen, Users } from "lucide-react";

export default function MobileNavbar() {
  const t = useTranslations('Navbar');
    
  return (
    <header className="flex h-20 w-full shrink-0 items-center justify-between px-4 md:px-6 bg-[#C61E1E]">
      {/* Logo on the left */}
      <Link href="/" className="flex items-center" prefetch={false}>
        <div className="text-white font-bold text-xl">Turkish Club</div>
      </Link>

      {/* Desktop navigation (hidden on mobile) */}
      <nav className="ml-auto hidden lg:flex gap-6 items-center">
        {/* Platformlar */}
        <div className="group relative">
          <button className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
            {t('platforms')}
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute left-0 mt-2 w-64 rounded-md bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
            <div className="py-1">
              <a href="https://www.instagram.com/turkishclub.munich/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100">
                <Instagram className="h-4 w-4 text-pink-500" />
                <div className="flex flex-col">
                  <div className="font-medium text-sm">{t('instagram')}</div>
                  <div className="text-xs text-gray-500">{t('instagramDesc')}</div>
                </div>
              </a>
              <a href="https://github.com/TurkishClub" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100">
                <Github className="h-4 w-4 text-gray-800" />
                <div className="flex flex-col">
                  <div className="font-medium text-sm">{t('github')}</div>
                  <div className="text-xs text-gray-500">{t('githubDesc')}</div>
                </div>
              </a>
              <a href="https://chat.whatsapp.com/LHzs06mN7iCG2cXlZHpZs9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <div className="flex flex-col">
                  <div className="font-medium text-sm">{t('whatsapp')}</div>
                  <div className="text-xs text-gray-500">{t('whatsappDesc')}</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Araçlar */}
        <div className="group relative">
          <button className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
            {t('tools')}
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute left-0 mt-2 w-64 rounded-md bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
            <div className="py-1">
              <Link href="/ev-arama" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100">
                <Search className="h-4 w-4 text-blue-500" />
                <div className="flex flex-col">
                  <div className="font-medium text-sm">{t('dormSearch')}</div>
                  <div className="text-xs text-gray-500">{t('dormSearchDesc')}</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Sayfalar */}
        <div className="group relative">
          <button className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
            {t('pages')}
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute left-0 mt-2 w-64 rounded-md bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
            <div className="py-1">
              <Link href="/blog" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100">
                <BookOpen className="h-4 w-4 text-orange-500" />
                <div className="flex flex-col">
                  <div className="font-medium text-sm">{t('blog')}</div>
                  <div className="text-xs text-gray-500">{t('blogDesc')}</div>
                </div>
              </Link>
              <Link href="/team" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100">
                <Users className="h-4 w-4 text-purple-500" />
                <div className="flex flex-col">
                  <div className="font-medium text-sm">{t('team')}</div>
                  <div className="text-xs text-gray-500">{t('teamDesc')}</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <Link
          href="https://forms.gle/zvAT7iFKN8PzR5Gb7"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          prefetch={false}
        >
          {t('joinTeam')}
        </Link>
        <LocaleSwitcher />
      </nav>

      {/* Mobile toggle button on the right */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
            <MenuIcon className="h-6 w-6"/>
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-[#C61E1E] text-white">
          <Link href="/" className="mr-6 flex items-center" prefetch={false}>
            <div className="text-white font-bold text-xl">Turkish Club</div>
          </Link>
          <div className="grid gap-2 py-6">
            {/* Platformlar Section */}
            <div className="py-2">
              <h3 className="text-lg font-semibold mb-2">{t('platforms')}</h3>
              <p className="text-sm text-gray-300 mb-3 px-2">{t('platformsDesc')}</p>
              <div className="pl-4 space-y-2">
                <a href="https://www.instagram.com/turkishclub.munich/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full py-2 text-sm hover:bg-white/10 rounded-md px-2 transition-colors">
                  <Instagram className="h-4 w-4 text-pink-400" />
                  <div className="flex flex-col">
                    <div className="font-medium">{t('instagram')}</div>
                    <div className="text-xs text-gray-300">{t('instagramDesc')}</div>
                  </div>
                </a>
                <a href="https://github.com/turkishclub" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full py-2 text-sm hover:bg-white/10 rounded-md px-2 transition-colors">
                  <Github className="h-4 w-4 text-gray-300" />
                  <div className="flex flex-col">
                    <div className="font-medium">{t('github')}</div>
                    <div className="text-xs text-gray-300">{t('githubDesc')}</div>
                  </div>
                </a>
                <a href="https://wa.me/your-whatsapp-number" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full py-2 text-sm hover:bg-white/10 rounded-md px-2 transition-colors">
                  <MessageCircle className="h-4 w-4 text-green-400" />
                  <div className="flex flex-col">
                    <div className="font-medium">{t('whatsapp')}</div>
                    <div className="text-xs text-gray-300">{t('whatsappDesc')}</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Araçlar Section */}
            <div className="py-2">
              <h3 className="text-lg font-semibold mb-2">{t('tools')}</h3>
              <p className="text-sm text-gray-300 mb-3 px-2">{t('toolsDesc')}</p>
              <div className="pl-4 space-y-2">
                <Link href="/ev-arama" className="flex items-center gap-3 w-full py-2 text-sm hover:bg-white/10 rounded-md px-2 transition-colors" prefetch={false}>
                  <Search className="h-4 w-4 text-blue-400" />
                  <div className="flex flex-col">
                    <div className="font-medium">{t('dormSearch')}</div>
                    <div className="text-xs text-gray-300">{t('dormSearchDesc')}</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Sayfalar Section */}
            <div className="py-2">
              <h3 className="text-lg font-semibold mb-2">{t('pages')}</h3>
              <p className="text-sm text-gray-300 mb-3 px-2">{t('pagesDesc')}</p>
              <div className="pl-4 space-y-2">
                <Link href="/blog" className="flex items-center gap-3 w-full py-2 text-sm hover:bg-white/10 rounded-md px-2 transition-colors" prefetch={false}>
                  <BookOpen className="h-4 w-4 text-orange-400" />
                  <div className="flex flex-col">
                    <div className="font-medium">{t('blog')}</div>
                    <div className="text-xs text-gray-300">{t('blogDesc')}</div>
                  </div>
                </Link>
                <Link href="/team" className="flex items-center gap-3 w-full py-2 text-sm hover:bg-white/10 rounded-md px-2 transition-colors" prefetch={false}>
                  <Users className="h-4 w-4 text-purple-400" />
                  <div className="flex flex-col">
                    <div className="font-medium">{t('team')}</div>
                    <div className="text-xs text-gray-300">{t('teamDesc')}</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Join Team Link */}
            <Link href="https://forms.gle/zvAT7iFKN8PzR5Gb7" target="_blank" rel="noopener noreferrer" className="flex w-full items-center py-2 text-lg font-semibold hover:bg-white/10 rounded-md px-2 transition-colors" prefetch={false}>
              {t('joinTeam')}
            </Link>
            
            <div className="pt-4">
              <LocaleSwitcher />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}