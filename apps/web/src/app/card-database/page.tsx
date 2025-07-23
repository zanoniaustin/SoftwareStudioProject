// apps/web/src/app/card-database/page.tsx
import { Suspense } from 'react';
import CardDatabaseClientPage from './CardDatabaseClientPage';

export default function CardDatabasePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardDatabaseClientPage />
    </Suspense>
  );
}
