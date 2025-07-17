// src/components/home/DatabaseSearch.tsx
'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/Button';
import {Card} from '@/components/ui/Card';

// Placeholder icons
const FilterIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path
        d="M3.5 2h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1M6 6h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1m-2 4h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1 0-1"/>
</svg>;
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path
        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>;

export function DatabaseSearch() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        router.push(`/card-database?q=${encodeURIComponent(query)}`);
    };

    return (
        <Card className="p-6">
            <div className="text-center mb-4">
                <div className="inline-block bg-violet-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="text-primary">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.3-4.3"/>
                    </svg>
                </div>
                <h3 className="text-xl font-semibold mt-2">Card Database</h3>
                <p className="text-sm text-text-secondary">Search through thousands of Pokémon cards in our
                    database.</p>
            </div>
            <div className="space-y-4">
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon/>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by card name, set, etc."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-md border-border-color py-2 pl-9 pr-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        className="flex items-center justify-between w-full text-left rounded-md border border-border-color bg-white px-3 py-2 text-sm text-text-secondary shadow-sm hover:bg-gray-50">Set/Series <FilterIcon/>
                    </button>
                    <button
                        className="flex items-center justify-between w-full text-left rounded-md border border-border-color bg-white px-3 py-2 text-sm text-text-secondary shadow-sm hover:bg-gray-50">Rarity <FilterIcon/>
                    </button>
                </div>
                <Button onClick={handleSearch} className="w-full">
                    Search Database
                </Button>
            </div>
        </Card>
    );
}
