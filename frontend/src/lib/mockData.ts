// src/lib/mockData.ts
import {CollectionItem, PokemonCard} from '@/types';

export const MOCK_CARDS: PokemonCard[] = [
    {
        id: 'base1-4',
        name: 'Charizard',
        imageUrl: 'https://images.pokemontcg.io/base1/4_hires.png',
        set: {name: 'Base Set', number: '4/102'},
        rarity: 'Holo Rare',
        estimatedPrice: 450
    },
    {
        id: 'base1-2',
        name: 'Blastoise',
        imageUrl: 'https://images.pokemontcg.io/base1/2_hires.png',
        set: {name: 'Base Set', number: '2/102'},
        rarity: 'Holo Rare',
        estimatedPrice: 95
    },
    {
        id: 'base1-15',
        name: 'Venusaur',
        imageUrl: 'https://images.pokemontcg.io/base1/15_hires.png',
        set: {name: 'Base Set', number: '15/102'},
        rarity: 'Holo Rare',
        estimatedPrice: 75
    },
    {
        id: 'base1-10',
        name: 'Mewtwo',
        imageUrl: 'https://images.pokemontcg.io/base1/10_hires.png',
        set: {name: 'Base Set', number: '10/102'},
        rarity: 'Holo Rare',
        estimatedPrice: 80
    },
    {
        id: 'base1-58',
        name: 'Pikachu',
        imageUrl: 'https://images.pokemontcg.io/base1/58_hires.png',
        set: {name: 'Base Set', number: '58/102'},
        rarity: 'Common',
        estimatedPrice: 5
    },
    {
        id: 'base1-52',
        name: 'Jigglypuff',
        imageUrl: 'https://images.pokemontcg.io/base1/52_hires.png',
        set: {name: 'Base Set', number: '54/102'},
        rarity: 'Common',
        estimatedPrice: 2
    },
];

export const MOCK_USER_COLLECTION: CollectionItem[] = [
    {...MOCK_CARDS[0], quantity: 1, userPhotoUrl: 'https://i.ebayimg.com/images/g/aJ0AAOSw2xRYg~6p/s-l1600.jpg'},
    {...MOCK_CARDS[1], quantity: 2},
    {...MOCK_CARDS[4], quantity: 5},
];
