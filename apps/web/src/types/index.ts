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
    set: {
        name: string;
        number: string;
    };
    rarity: string;
    imageUrl: string;
    estimatedPrice: number;
}

// This represents the raw data from the Python API
export interface BackendCardResponse {
    id: string;
    name: string;
    set: string; // The backend sends 'set' as a string
    rarity: string;
    official_card_image_url: string; // The backend sends this key
    // ... add any other fields the backend sends
}

/** Represents a card within a user's personal collection. */
export interface CollectionItem extends PokemonCard {
    quantity: number;
    userPhotoUrl?: string; // Optional custom photo uploaded by the user
}
