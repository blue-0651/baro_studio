'use client';

import Link from 'next/link';

export default function Error() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
            <p className="mb-6">We're working on something amazing. Please check back later.</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md">
                Back to Home
            </Link>
        </div>
    );
}