// src/types/index.ts

/** Represents a logged-in user. */
export interface User {
    id: string;
    username: string;
    email: string;
}

/** Represents a standard Pokémon card from the global database. */
export interface PokemonCard {
    id: string;
    name: string;
    imageUrl: string;
    set: {
        name: string;
        number: string;
    };
    rarity: string;
    estimatedPrice: number;
}

/** Represents a card within a user's personal collection. */
export interface CollectionItem extends PokemonCard {
    quantity: number;
    userPhotoUrl?: string; // Optional custom photo uploaded by the user
}
