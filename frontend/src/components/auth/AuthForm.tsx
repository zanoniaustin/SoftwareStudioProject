// src/components/auth/AuthForm.tsx
'use client';
import {FormEvent, useState} from 'react';
import {Button} from '@/components/ui/Button';

interface AuthFormProps {
    formType: 'login' | 'register';
    onSubmit: (data: any) => Promise<void>;
}

export function AuthForm({formType, onSubmit}: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const data = formType === 'login' ? {email, password} : {username, email, password};
        await onSubmit(data);
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {formType === 'register' && (
                <div>
                    <label className="block text-sm font-medium text-text-secondary" htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-border-color shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-text-secondary" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-border-color shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary" htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-border-color shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Processing...' : (formType === 'login' ? 'Sign In' : 'Create Account')}
            </Button>
        </form>
    );
}
