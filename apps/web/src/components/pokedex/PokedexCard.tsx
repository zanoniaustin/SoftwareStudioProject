// src/components/pokedex/PokedexCard.tsx
import Image from 'next/image';
import { CollectionItem } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PokedexCardProps {
  item: CollectionItem;
  // Add functions for editing quantity and removing card as props
}

export function PokedexCard({ item }: PokedexCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="aspect-[3/4] bg-gray-100 relative">
        <Image
          src={item.userPhotoUrl || item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!item.userPhotoUrl && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary">
              Add Photo
            </Button>
          </div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <p className="font-bold truncate">{item.name}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-text-secondary">Quantity:</p>
          <p className="font-semibold">{item.quantity}</p>
        </div>
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="secondary" className="w-full">
            Edit
          </Button>
          <Button size="sm" variant="destructive" className="w-full">
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
}
