// src/components/cards/CardItem.tsx
import Image from 'next/image';
import { PokemonCard } from '../../types';
import { Card } from '../ui/Card';

export function CardItem({ card }: { card: PokemonCard }) {
  return (
    // The main card container with hover effects
    <Card className="bg-gray-50/50 group relative overflow-hidden rounded-xl border-gray-200 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      {/* The inner container for the image with padding */}
      <div className="aspect-[3/4] rounded-lg bg-white p-4 m-2">
        <Image
          src={card.imageUrl}
          alt={card.name}
          width={250}
          height={350}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 pt-0 text-center">
        <p className="font-bold truncate text-text-primary">{card.name}</p>
        <p className="text-sm text-text-secondary">
          {card.set.name} - {card.rarity}
        </p>
        <p className="text-right font-semibold mt-2 text-primary pr-2">
          ${card.estimatedPrice}
        </p>
      </div>
    </Card>
  );
}
