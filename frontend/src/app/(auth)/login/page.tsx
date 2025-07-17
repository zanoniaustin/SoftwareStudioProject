// src/app/(auth)/login/page.tsx
'use client';
import {useAuth} from '@/lib/hooks';
import {AuthForm} from '@/components/auth/AuthForm';
import {Card} from '@/components/ui/Card';

export default function LoginPage() {
    const {login} = useAuth();

    return (
        <div className="flex justify-center items-center pt-10">
            <Card className="w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
                <AuthForm formType="login" onSubmit={login}/>
            </Card>
        </div>
    );
}
