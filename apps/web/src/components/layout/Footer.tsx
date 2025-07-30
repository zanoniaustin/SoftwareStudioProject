// src/components/layout/Footer.tsx
export function Footer() {
    return (
        <footer className="border-t border-border-color">
            <div className="container flex h-14 items-center justify-center">
                <p className="text-center text-sm text-text-secondary">
                    &copy; {new Date().getFullYear()} PokéHub. All rights reserved. Pokémon and Pokémon character names
                    are trademarks of Nintendo.
                </p>
            </div>
        </footer>
    );
}
