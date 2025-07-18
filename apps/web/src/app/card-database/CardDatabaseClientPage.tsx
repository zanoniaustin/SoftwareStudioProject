// apps/web/src/app/card-database/CardDatabaseClientPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchDatabase } from '../../lib/apiClient';
import type { PokemonCard } from '../../types';
import { CardGrid } from '../../components/cards/CardGrid';
import { CardItem } from '../../components/cards/CardItem';
import { Button } from '../../components/ui/Button';

export default function CardDatabaseClientPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      const results = await searchDatabase({ query });
      setCards(results);
      setLoading(false);
    };
    fetchCards();
  }, [query]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Card Database</h1>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name..."
          defaultValue={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border-border-color shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        <Button>Search</Button>
      </div>
      {loading ? (
        <p>Searching for cards...</p>
      ) : (
        <CardGrid>
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </CardGrid>
      )}
    </div>
  );
}
