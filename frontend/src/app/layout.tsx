// src/app/layout.tsx
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {AuthProvider} from '@/context/AuthContext';
import {Navbar} from '@/components/layout/Navbar';
import {Footer} from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'Pokémon Card Hub',
    description: 'Identify, search, and manage your Pokémon card collection.',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                <main className="flex-grow container mx-auto p-4 md:p-6">
                    {children}
                </main>
                <Footer/>
            </div>
        </AuthProvider>
        </body>
        </html>
    );
}
