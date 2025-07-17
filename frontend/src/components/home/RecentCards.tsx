// src/components/home/RecentCards.tsx
'use client';
import {useEffect, useState} from 'react';
import {PokemonCard} from '@/types';
import {searchDatabase} from '@/lib/apiClient';
import {CardGrid} from '../cards/CardGrid';
import {CardItem} from '../cards/CardItem';
import {Button} from "@/components/ui/Button";

export function RecentCards() {
    const [cards, setCards] = useState<PokemonCard[]>([]);

    useEffect(() => {
        const fetchRecent = async () => {
            const results = await searchDatabase({query: ''});
            setCards(results.slice(0, 5));
        };
        fetchRecent();
    }, []);

    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Recent Cards</h2>
                {/* Placeholder for layout toggle buttons */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-violet-100"></div>
                    <div className="w-8 h-8 rounded-md bg-primary"></div>
                </div>
            </div>
            <CardGrid>
                {cards.map(card => <CardItem key={card.id} card={card}/>)}
            </CardGrid>
            <div className="text-center mt-8">
                <Button variant="secondary">Load More Cards</Button>
            </div>
        </section>
    );
}
