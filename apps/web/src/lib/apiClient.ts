// src/lib/apiClient.ts
import {BackendCardResponse, CollectionItem, PokemonCard, User} from '../types';
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
export async function identifyCard(file: File): Promise<BackendCardResponse> {
    const formData = new FormData();
    formData.append('file', file); // Ensure the key matches the FastAPI backend ('file')

    const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to identify card');
    }
    return response.json();
}

export const searchDatabase = async (filters: {
    query: string;
}): Promise<PokemonCard[]> => {
    console.log('API Call: Searching database with filters:', filters);
    await delay(800);
    if (!filters.query) return MOCK_CARDS;
    return MOCK_CARDS.filter((card) =>
        card.name.toLowerCase().includes(filters.query?.toLowerCase() || '')
    );
};

// --- Collection API ---
export const getCollection = async (
    userId: string
): Promise<CollectionItem[]> => {
    console.log(`API Call: Fetching collection for user: ${userId}`);
    await delay(1200);
    return MOCK_USER_COLLECTION;
};
