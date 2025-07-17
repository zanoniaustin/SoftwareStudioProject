// src/components/pokedex/PokedexGrid.tsx
'use client';
import {useEffect, useState} from 'react';
import {getCollection} from '@/lib/apiClient';
import {CollectionItem} from '@/types';
import {PokedexCard} from './PokedexCard';
import {CardGrid} from '../cards/CardGrid';

interface PokedexGridProps {
    userId: string;
}

export function PokedexGrid({userId}: PokedexGridProps) {
    const [collection, setCollection] = useState<CollectionItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollection = async () => {
            setLoading(true);
            const userPokedex = await getCollection(userId);
            setCollection(userPokedex);
            setLoading(false);
        };
        fetchCollection();
    }, [userId]);

    if (loading) return <p>Loading your collection...</p>;

    if (collection.length === 0) {
        return <p>Your Pokédex is empty. Start by identifying a card or searching the database!</p>
    }

    return (
        <CardGrid>
            {collection.map(item => (
                <PokedexCard key={item.id} item={item}/>
            ))}
        </CardGrid>
    );
}
