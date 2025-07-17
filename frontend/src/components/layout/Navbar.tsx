// src/components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {useAuth} from '@/lib/hooks';
import {Button} from '@/components/ui/Button';

export function Navbar() {
    const {user, logout} = useAuth();

    return (
        <header
            className="sticky top-0 z-50 w-full border-b border-border-color bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
            <div className="container flex h-14 items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Image src="/favicon.ico" alt="PokéHub Logo" width={24} height={24}/>
                    <span className="font-bold">PokéHub</span>
                </Link>
                <nav className="flex flex-1 items-center justify-end space-x-4">
                    <Link href="/card-database"
                          className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
                        Database
                    </Link>
                    {user ? (
                        <>
                            <Link href="/my-pokedex"
                                  className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
                                My Pokédex
                            </Link>
                            <Button onClick={logout} variant="secondary" size="sm">Logout</Button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login"
                                  className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
                                Login
                            </Link>
                            <Button asChild size="sm">
                                <Link href="/auth/register">Register</Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
