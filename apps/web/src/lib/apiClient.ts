// src/lib/apiClient.ts
import { CollectionItem, PokemonCard, User } from "../types";
import {MOCK_USER_COLLECTION} from './mockData';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.pokehub.just-incredible.dev";

console.log("API_BASE:", API_BASE);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Auth API ---
export const login = async (credentials: {
    email: string;
    password: string;
}): Promise<User> => {
    console.log('API Call: Logging in with:', credentials);

    const url = `${API_BASE}/login`;
    const formData = new FormData();
    formData.append('input_email', credentials.email);
    formData.append('input_password', credentials.password);

    const resp = await fetch(url, { method: 'POST', body: formData });
    if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Login failed');
    }

    const data = await resp.json();
    if ('error' in data) throw new Error(data.error);
    return data as User;
};

export const register = async (userInfo: {
    username: string;
    email: string;
    password: string;
}): Promise<User> => {
    // The URL of your Next.js API route
    const registerApiUrl = `${API_BASE}/register`;
    const formData = new FormData();
    formData.append("input_username", userInfo.username);
    formData.append("input_email", userInfo.email);
    formData.append("input_password", userInfo.password);

    const resp = await fetch(registerApiUrl, { method: 'POST', body: formData });
    if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Register failed could not connect to server');
    }
    const data = await resp.json();
    if ('error' in data) throw new Error(data.error);
    return data as User;
};

export const logout = async (): Promise<{ success: true }> => {
    console.log('API Call: Logging out');
    await delay(200);
    return {success: true};
};

// --- Card API ---
export const identifyCard = async (imageFile: File): Promise<PokemonCard> => {
    // Prepare form data
    const url = `${API_BASE}/identify_card`;
    const formData = new FormData();
    formData.append('file', imageFile);

    const resp = await fetch(url, { method: 'POST', body: formData });
    if (!resp.ok) throw new Error('Failed to identify card');

    const data = await resp.json();

    // Map backend response to your PokemonCard type as needed
    return {
        id: data.id,
        name: data.name,
        set: {
            name: data.set,
            number: '', // Fill if available
        },
        rarity: data.rarity,
        imageUrl: data.official_card_image_url,
        base64Image: data.base64_image,
        estimatedPrice: data.price, // This is the EST price from main.py
    };
};

// --- Collection API ---
export const getCollection = async (
    userId: string
): Promise<CollectionItem[]> => {
    console.log(`API Call: Fetching collection for user: ${userId}`);
    await delay(1200);
    return MOCK_USER_COLLECTION;
};

export const searchDatabase = async ({query} : {query: string;}): Promise<PokemonCard[]> => {
  const url = `${API_BASE}/search_cards?query=${encodeURIComponent(query)}`;
  const resp = await fetch(url, { method: 'POST' });

  if (!resp.ok) throw new Error('Failed to search for cards');

  const data = await resp.json();

   return data.map((card: any) => ({
    id: card.id,
    name: card.name,
    set: { name: card.set.name ?? card.set, number: card.set.number ?? "" },
    rarity: card.rarity,
    imageUrl: "",
    base64Image: card.base64_image,
    estimatedPrice: card.price,
  }));
};