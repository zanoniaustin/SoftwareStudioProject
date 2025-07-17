// src/components/home/ImageUploader.tsx
'use client';
import {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useRouter} from 'next/navigation';
import {identifyCard} from '@/lib/apiClient';
import {Card} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';

// A simple camera icon component
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
        <circle cx="12" cy="13" r="3"/>
    </svg>
);

export function ImageUploader() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setLoading(true);
            try {
                const result = await identifyCard(file);
                const query = new URLSearchParams({
                    card: JSON.stringify(result),
                    userImage: URL.createObjectURL(file)
                }).toString();
                router.push(`/identify/results?${query}`);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    }, [router]);

    const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
        onDrop,
        noClick: true, // We'll use our own button to trigger the file dialog
        noKeyboard: true,
        accept: {'image/*': ['.jpeg', '.png', '.jpg', '.webp']},
        multiple: false,
    });

    return (
        <Card className="p-6">
            <div className="text-center mb-4">
                <div className="inline-block bg-violet-100 p-3 rounded-full">
                    <CameraIcon/>
                </div>
                <h3 className="text-xl font-semibold mt-2">Card Identification</h3>
                <p className="text-sm text-text-secondary">Upload a photo of your Pokémon card to identify it
                    instantly.</p>
            </div>
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg h-48 transition-colors ${
                    isDragActive ? 'border-primary bg-violet-50' : 'border-border-color'
                }`}
            >
                <input {...getInputProps()} />
                <div className="text-center">
                    {loading ? (
                        <p>Analyzing...</p>
                    ) : (
                        <>
                            <p className="font-semibold">Drop your card image here</p>
                            <p className="text-sm text-text-secondary">or click to browse</p>
                        </>
                    )}
                </div>
            </div>
            <Button onClick={open} className="w-full mt-4" disabled={loading}>
                Choose File
            </Button>
        </Card>
    );
}
