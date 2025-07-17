// src/app/page.tsx
import {ImageUploader} from '@/components/home/ImageUploader';
import {DatabaseSearch} from '@/components/home/DatabaseSearch';
import {RecentCards} from '@/components/home/RecentCards';
import {Card} from '@/components/ui/Card';

export default function HomePage() {
    return (
        // Main page container with a max-width and vertical padding
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* The main content card with background, rounding, and shadow */}
            <Card className="p-6 sm:p-8 lg:p-12 space-y-12 bg-surface rounded-2xl shadow-lg">
                <header className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                        Pokémon Card Hub
                    </h1>
                    <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
                        Upload your Pokémon cards for instant identification or browse our extensive database.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ImageUploader/>
                    <DatabaseSearch/>
                </div>

                <RecentCards/>
            </Card>
        </div>
    );
}
