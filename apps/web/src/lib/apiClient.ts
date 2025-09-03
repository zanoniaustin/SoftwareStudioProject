// src/lib/apiClient.ts
import {CollectionItem, PokemonCard, User} from '../types';
import {MOCK_USER_COLLECTION} from './mockData';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Auth API ---
export const login = async (credentials: {
    email: string;
    password: string;
}): Promise<User> => {
    console.log('API Call: Logging in with:', credentials);

    // The URL of your Next.js API route
    const loginApiUrl = '/api/login';
  
    try {
        // Create a FormData object to send the credentials
        const formData = new FormData();
        formData.append('input_email', credentials.email);
            formData.append('input_password', credentials.password);
    
        const response = await fetch(loginApiUrl, {
            method: 'POST',
            body: formData,
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login Failed');
        }
  
        // Assuming the backend returns the user data on successful login
        const backend_response = await response.json();

        if ('error' in backend_response) {
            throw new Error(backend_response.error);
        }

        const user: User = backend_response
        return user;
  
    } catch (error) {
        console.error('Login error:', error);
        // Log the specific URL that failed to help with debugging
        console.error('Failed to make API call to:', loginApiUrl);
        throw new Error('Login Failed: Could not connect to the authentication service.');
    }
};

export const register = async (userInfo: {
    username: string;
    email: string;
    password: string;
}): Promise<User> => {
    // The URL of your Next.js API route
    const registerApiUrl = '/api/register';
  
    try {
        // Create a FormData object to send the credentials
        const formData = new FormData();
        formData.append('input_username', userInfo.username);
        formData.append('input_email', userInfo.email);
        formData.append('input_password', userInfo.password);
    
        const response = await fetch(registerApiUrl, {
            method: 'POST',
            body: formData,
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Register Failed');
        }
  
        // Assuming the backend returns the user data on successful login
        const backend_response = await response.json();

        if ('error' in backend_response) {
            throw new Error(backend_response.error);
        }

        const user: User = backend_response
        return user;
  
    } catch (error) {
        console.error('Register error:', error);
        // Log the specific URL that failed to help with debugging
        console.error('Failed to make API call to:', registerApiUrl);
        throw new Error('Register Failed: Could not connect to the authentication service.');
    }
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
        throw new Error('Failed to identify card');
    }

    const data = await response.json();

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

export const searchDatabase = async ({
                                         query,
                                     }: {
    query: string;
}): Promise<PokemonCard[]> => {
    try {
        const response = await fetch(`http://localhost:8000/search_cards?query=${encodeURIComponent(query)}`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('Failed to search for cards');
        }

        const data = await response.json();

        return data.map((card: any) => ({
            id: card.id,
            name: card.name,
            set: { // The backend now sends this as a nested object
                name: card.set.name,
                number: card.set.number,
            },
            rarity: card.rarity,
            imageUrl: '', // Set to empty as we are using the base64 image
            base64Image: card.base64_image,
            estimatedPrice: card.price,
        }));

    } catch (error) {
        console.error("Error searching database:", error);
        return [];
    }
};
