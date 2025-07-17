// tailwind.config.ts
import type {Config} from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#6d28d9',
                'primary-foreground': '#ffffff',
                'secondary': '#e5e7eb',
                'secondary-foreground': '#1f2937',
                'destructive': '#ef4444',
                'destructive-foreground': '#ffffff',
                'background': '#f3f4f6',
                'surface': '#ffffff',
                'text-primary': '#1f2937',
                'text-secondary': '#6b7280',
                'border-color': '#e5e7eb',
            },
        },
    },
    plugins: [],
}

export default config
