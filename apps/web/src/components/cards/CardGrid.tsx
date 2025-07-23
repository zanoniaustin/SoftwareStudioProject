// src/components/cards/CardGrid.tsx
import {ReactNode} from 'react';

export function CardGrid({children}: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {children}
        </div>
    );
}
