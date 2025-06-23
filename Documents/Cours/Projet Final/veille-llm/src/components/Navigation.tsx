'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Accueil
            </Link>
            <Link 
              href="/veille" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/veille') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Veille
            </Link>
            <Link 
              href="/patches" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/patches') ? 'text-primary font-bold' : 'text-muted-foreground'
              }`}
            >
              <span className="flex items-center gap-1">
                <span>Patches</span>
                {isActive('/patches') && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
              </span>
            </Link>
            <Link 
              href="/a-propos" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/a-propos') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              À propos
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/contact') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 