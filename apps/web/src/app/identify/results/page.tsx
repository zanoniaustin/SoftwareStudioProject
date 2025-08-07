// src/app/identify/results/page.tsx
'use client';
import {useSearchParams} from 'next/navigation';
import Image from 'next/image';
import {PokemonCard} from '../../../types';
import {Card} from '../../../components/ui/Card';
import {Button} from '../../../components/ui/Button';
import {Suspense, useEffect, useState} from 'react';

function IdentificationResults() {
    const searchParams = useSearchParams();
    const [card, setCard] = useState<PokemonCard | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // The user-uploaded image is still passed via URL, as it's a small blob URL
    const userImageUrl = searchParams.get('userImage');

    useEffect(() => {
        // Fix: Retrieve the card data from sessionStorage on component mount
        const cardString = sessionStorage.getItem('identificationResult');
        if (cardString) {
            setCard(JSON.parse(cardString));
            // Clean up sessionStorage after reading the data
            sessionStorage.removeItem('identificationResult');
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <p>Loading results...</p>;
    }

    if (!card || !userImageUrl) {
        return <p>No identification data found. Please try again.</p>;
    }

    // Determine the image source, preferring the official URL but falling back to Base64.
    const officialImageSrc = card.imageUrl || (card.base64Image ? `data:image/png;base64,${card.base64Image}` : 'https://placehold.co/600x800/eeeeee/cccccc?text=No+Image');

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
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onLoad={() => URL.revokeObjectURL(userImageUrl)} // Clean up blob URL memory
                            />
                        </div>
                    </Card>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Official Match</h2>
                    <Card className="p-4 flex flex-col gap-4">
                        <div className="aspect-[3/4] relative">
                            <Image
                                src={officialImageSrc}
                                alt={card.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://placehold.co/600x800/eeeeee/cccccc?text=Image+Error';
                                }}
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">{card.name}</h3>
                            <p>
                                {card.set.name} - {card.set.number}
                            </p>
                            <p>Rarity: {card.rarity}</p>
                            <p className="text-lg font-semibold mt-4">
                                Est. Price: {card.estimatedPrice}
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
        <Suspense fallback={<div>Loading...</div>}>
            <IdentificationResults/>
        </Suspense>
    );
}
