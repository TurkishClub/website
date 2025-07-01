"use client";
import React from "react";
import Link from "next/link";
import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Instagram, Github, MessageCircle, Search, BookOpen, Users } from "lucide-react";

export default function Navbar() {
  const t = useTranslations('Navbar');

  return (
    <header className="flex justify-between items-center p-4 bg-[#C61E1E]">
      <Link href="/" className="text-white font-bold text-xl">
        Turkish Club
      </Link>
      
      <div className="flex gap-4 justify-center items-center">
        {/* Platformlar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-white hover:text-gray-200 transition-colors">
            {t('platforms')}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg w-64">
            <DropdownMenuItem asChild>
              <a 
                href="https://www.instagram.com/turkishclub.munich/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <Instagram className="h-4 w-4 text-pink-500" />
                <div className="flex flex-col">
                  <div className="font-medium">{t('instagram')}</div>
                  <div className="text-sm text-gray-500">{t('instagramDesc')}</div>
                </div>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a 
                href="https://github.com/turkishclub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <Github className="h-4 w-4 text-gray-800" />
                <div className="flex flex-col">
                  <div className="font-medium">{t('github')}</div>
                  <div className="text-sm text-gray-500">{t('githubDesc')}</div>
                </div>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a 
                href="https://wa.me/your-whatsapp-number" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 text-green-500" />
                <div className="flex flex-col">
                  <div className="font-medium">{t('whatsapp')}</div>
                  <div className="text-sm text-gray-500">{t('whatsappDesc')}</div>
                </div>
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Araçlar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-white hover:text-gray-200 transition-colors">
            {t('tools')}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg w-64">
            <DropdownMenuItem asChild>
              <Link 
                href="/ev-arama" 
                className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <Search className="h-4 w-4 text-blue-500" />
                <div className="flex flex-col">
                  <div className="font-medium">{t('dormSearch')}</div>
                  <div className="text-sm text-gray-500">{t('dormSearchDesc')}</div>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sayfalar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-white hover:text-gray-200 transition-colors">
            {t('pages')}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg w-64">
            <DropdownMenuItem asChild>
              <Link 
                href="/blog" 
                className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-orange-500" />
                <div className="flex flex-col">
                  <div className="font-medium">{t('blog')}</div>
                  <div className="text-sm text-gray-500">{t('blogDesc')}</div>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                href="/team" 
                className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <Users className="h-4 w-4 text-purple-500" />
                <div className="flex flex-col">
                  <div className="font-medium">{t('team')}</div>
                  <div className="text-sm text-gray-500">{t('teamDesc')}</div>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Join Team Link */}
        <Link 
          href="https://forms.gle/zvAT7iFKN8PzR5Gb7" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-200 transition-colors"
        >
          {t('joinTeam')}
        </Link>

        <LocaleSwitcher />
      </div>
    </header>
  )
}
