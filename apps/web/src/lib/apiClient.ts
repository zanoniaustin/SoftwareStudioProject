// src/lib/apiClient.ts
import {CollectionItem, PokemonCard, User} from '../types';
import {MOCK_CARDS, MOCK_USER_COLLECTION} from './mockData';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Auth API ---
export const login = async (credentials: {
    email: string;
    password?: string;
}): Promise<User> => {
    console.log('API Call: Logging in with:', credentials);
    await delay(500);
    if (
        credentials.email === 'ash@ketchum.com' &&
        credentials.password === 'pikachu'
    ) {
        return {id: 'user123', username: 'AshK', email: 'ash@ketchum.com'};
    }
    throw new Error('Invalid credentials');
};

export const register = async (userInfo: {
    username: string;
    email: string;
    password?: string;
}): Promise<User> => {
    console.log('API Call: Registering user:', userInfo);
    await delay(700);
    return {
        id: `user${Date.now()}`,
        username: userInfo.username,
        email: userInfo.email,
    };
};

export const logout = async (): Promise<{ success: true }> => {
    console.log('API Call: Logging out');
    await delay(200);
    return {success: true};
};

// --- Card API ---
export const identifyCard = async (imageFile: File): Promise<PokemonCard> => {
    // Prepare form data
    const formData = new FormData();
    formData.append('file', imageFile);

    // Call the FastAPI backend
    const response = await fetch('http://localhost:8000/identify_card', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({error: 'Failed to identify card'}));
        throw new Error(errorData.error || 'Failed to identify card');
    }

    const data = await response.json();

    // Map backend response to your PokemonCard type
    return {
        id: data.id,
        name: data.name,
        set: {
            name: data.set,
            number: '', // Fill if available
        },
        rarity: data.rarity,
        imageUrl: data.official_card_image_url,
        base64Image: data.base64_image, // Added: Map the base64 image
        estimatedPrice: data.price, // Changed: This is now a string (e.g., "$25.50")
    };
};

// --- Collection API ---
export const getCollection = async (
    userId: string
): Promise<CollectionItem[]> => {
    console.log(`API Call: Fetching collection for user: ${userId}`);
    await delay(1200);
    // NOTE: This mock data is updated to reflect the new price format.
    // The 'any' type assertion is used to bridge the mock data (where price is a number)
    // with the new CollectionItem type (where price is a string).
    return MOCK_USER_COLLECTION.map((item: any) => ({
        ...item,
        estimatedPrice: typeof item.estimatedPrice === 'number'
            ? `$${item.estimatedPrice.toFixed(2)}`
            : item.estimatedPrice,
    }));
};

export const searchDatabase = async ({
                                         query,
                                     }: {
    query: string;
}): Promise<PokemonCard[]> => {
    // For now, just return all mock cards that match the query in the name
    await delay(500);
    // NOTE: This mock data is updated to reflect the new price format.
    const results = !query
        ? MOCK_CARDS
        : MOCK_CARDS.filter((card) =>
            card.name.toLowerCase().includes(query.toLowerCase())
        );

    // The 'any' type assertion is used to bridge the mock data (where price is a number)
    // with the new PokemonCard type (where price is a string).
    return results.map((card: any) => ({
        ...card,
        estimatedPrice: typeof card.estimatedPrice === 'number'
            ? `$${card.estimatedPrice.toFixed(2)}`
            : card.estimatedPrice,
    }));
};
