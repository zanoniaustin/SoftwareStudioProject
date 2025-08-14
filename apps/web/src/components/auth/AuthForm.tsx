// src/components/auth/AuthForm.tsx
'use client';
import { FormEvent, useState } from 'react';
import { Button } from '../ui/Button';

interface AuthFormProps {
  formType: 'login' | 'register';
  onSubmit: (data: any) => Promise<void>;
}

export function AuthForm({ formType, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    const isValid = /\S+@\S+\.\S+/.test(newEmail);
    setIsInvalidEmail(!isValid && newEmail.length > 0);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data =
      formType === 'login'
        ? { email, password }
        : { username, email, password };
    await onSubmit(data);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formType === 'register' && (
        <div>
          <label
            className="block text-sm font-medium text-text-secondary"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      )}
      <div>
        <label
          className="block text-sm font-medium text-text-secondary"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={handleEmailChange}
          required
          className={`mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-primary focus:ring-primary sm:text-sm
            ${isInvalidEmail ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-primary'}  `}/>
      </div>
      <div>
        <label
          className="block text-sm font-medium text-text-secondary"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? 'Processing...'
          : formType === 'login'
          ? 'Sign In'
          : 'Create Account'}
      </Button>
    </form>
  );
}
