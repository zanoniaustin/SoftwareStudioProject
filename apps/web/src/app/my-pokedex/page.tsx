// src/app/my-pokedex/page.tsx
'use client';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { PokedexGrid } from '../../components/pokedex/PokedexGrid';

export default function MyPokedexPage() {
  return (
    <AuthGuard>
      {(user) => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{user.username}&#39;s Pokédex</h1>
          {/* Add Search/Filter controls for the user's collection here */}
          <PokedexGrid userId={user.id} />
        </div>
      )}
    </AuthGuard>
  );
}
