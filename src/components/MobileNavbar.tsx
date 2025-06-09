"use client"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { JSX, SVGProps } from "react"
import LocaleSwitcher from "./LocaleSwitcher"
import {useTranslations} from 'next-intl';

export default function Component() {
const t = useTranslations('Navbar');
    
  return (
    <header className="flex h-20 w-full shrink-0 items-center justify-between px-4 md:px-6">
      {/* Logo on the left */}
      <Link href="/" className="flex items-center" prefetch={false}>
        <div className="text-white font-bold text-xl">Turkish Club</div>
      </Link>

      {/* Desktop navigation (hidden on mobile) */}
      <nav className="ml-auto hidden lg:flex gap-6 items-center">
        <Link
          href="/team"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          prefetch={false}
        >
          Team
        </Link>
        <Link
          href="https://www.instagram.com/turkishclub.munich/"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          prefetch={false}
        >
          Instagram
        </Link>
        <Link
          href="https://forms.gle/iS1KwY2zUePvcnVS8"
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
            <Link href="/team" className="flex w-full items-center py-2 text-lg font-semibold hover:bg-white/10 rounded-md px-2 transition-colors" prefetch={false}>
              Team
            </Link>
            <Link href="https://www.instagram.com/turkishclub.munich/" className="flex w-full items-center py-2 text-lg font-semibold hover:bg-white/10 rounded-md px-2 transition-colors" prefetch={false}>
              Instagram
            </Link>
            <Link href="https://forms.gle/iS1KwY2zUePvcnVS8" className="flex w-full items-center py-2 text-lg font-semibold hover:bg-white/10 rounded-md px-2 transition-colors" prefetch={false}>
              {t('joinTeam')}
            </Link>
            <LocaleSwitcher />
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