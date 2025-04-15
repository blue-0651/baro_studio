'use client'
import { useState, type FormEvent, useEffect, Suspense } from 'react';
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from "lucide-react";

function getErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'CredentialsSignin':
            return 'Invalid admin ID or password. Please try again.';
        case 'AccessDenied':
            return 'Access denied. You do not have permission to sign in.';
        default:
            return `Login failed (${errorCode}). Please try again.`;
    }
}

// SearchParams를 사용하는 컴포넌트를 분리
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const callbackError = searchParams.get('error');
        if (callbackError && !error) {
            setError(getErrorMessage(callbackError));
        }
    }, [searchParams, error]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                adminId: adminId,
                password: password,
                redirect: false,
            });

            if (result?.error) {
                setError(getErrorMessage(result.error));
                setIsLoading(false);
            } else if (result?.ok && !result?.error) {
                const callbackUrl = searchParams.get('callbackUrl') || '/';
                router.push(callbackUrl);
            } else {
                setError("An unexpected error occurred during login.");
                setIsLoading(false);
            }

        } catch (networkError) {
            setError('An unexpected error occurred. Please try again later.');
            setIsLoading(false);
        }
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
                <div>
                    <label htmlFor="adminId" className="sr-only">
                        Admin ID
                    </label>
                    <input
                        id="adminId"
                        name="adminId"
                        type="text"
                        required
                        placeholder='input your admin ID'
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        disabled={isLoading}
                    />
                </div>
                <div className='mt-1'>
                    <label htmlFor="password-login" className="sr-only">
                        Password
                    </label>
                    <input
                        id="password-login"
                        name="password"
                        type="password"
                        placeholder='input your pwd'
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading || !adminId || !password}
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5 mr-3" aria-hidden="true" />
                            Processing...
                        </>
                    ) : (
                        'Sign in'
                    )}
                </button>
            </div>
        </form>
    );
}

// 로딩 상태를 위한 fallback 컴포넌트
function LoginFormFallback() {
    return (
        <div className="mt-8 space-y-6">
            <div className="animate-pulse bg-gray-200 h-12 rounded-md"></div>
            <div className="-space-y-px rounded-md shadow-sm">
                <div>
                    <div className="animate-pulse bg-gray-200 h-10 rounded-t-md"></div>
                </div>
                <div className='mt-1'>
                    <div className="animate-pulse bg-gray-200 h-10 rounded-b-md"></div>
                </div>
            </div>
            <div>
                <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Admin Login
                    </h2>
                </div>
                <Suspense fallback={<LoginFormFallback />}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}