import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFBF5] px-4">
            <div className="text-center">
                <h2 className="text-3xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    The page you requested does not exist or has been moved.
                    Please check that the address is correct.
                </p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-[#F68E1E] rounded-md hover:bg-[#E57D0D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A6D6E7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg duration-200"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
