// src/app/identify/results/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { PokemonCard } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Suspense } from 'react';

function IdentificationResults() {
  const searchParams = useSearchParams();
  const cardString = searchParams.get('card');
  const userImageUrl = searchParams.get('userImage');

  if (!cardString || !userImageUrl) {
    return <p>No identification data found. Please try again.</p>;
  }

  const card: PokemonCard = JSON.parse(cardString);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Identification Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Upload</h2>
          <Card className="overflow-hidden">
            <div className="aspect-[3/4] relative">
              <Image
                src={userImageUrl}
                alt="User uploaded card"
                fill
                className="object-contain"
              />
            </div>
          </Card>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Official Match</h2>
          <Card className="p-4 flex flex-col gap-4">
            <div className="aspect-[3/4] relative">
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{card.name}</h3>
              <p>
                {card.set.name} - {card.set.number}
              </p>
              <p>Rarity: {card.rarity}</p>
              <p className="text-lg font-semibold mt-4">
                Est. Price: ${card.estimatedPrice}
              </p>
            </div>
            <Button className="w-full mt-auto">Add to My Pokédex</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense because useSearchParams requires it
export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <IdentificationResults />
    </Suspense>
  );
}
