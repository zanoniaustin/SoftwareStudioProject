// src/app/(auth)/register/page.tsx
'use client';
import {useAuth} from '@/lib/hooks';
import {AuthForm} from '@/components/auth/AuthForm';
import {Card} from '@/components/ui/Card';

export default function RegisterPage() {
    const {register} = useAuth();

    return (
        <div className="flex justify-center items-center pt-10">
            <Card className="w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
                <AuthForm formType="register" onSubmit={register}/>
            </Card>
        </div>
    );
}
