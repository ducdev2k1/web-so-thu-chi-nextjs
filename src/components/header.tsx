"use client"

import Link from "next/link"
import { Wallet } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  const navLinkClasses = (path: string) =>
    cn(
      'transition-colors hover:text-primary',
      pathname === path ? 'text-primary font-semibold' : 'text-muted-foreground'
    );
    
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="font-bold">FinanceFlow</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className={navLinkClasses('/')}>
              Dashboard
            </Link>
            <Link href="/statistics" className={navLinkClasses('/statistics')}>
              Statistics
            </Link>
            <Link href="/calendar" className={navLinkClasses('/calendar')}>
              Calendar
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
