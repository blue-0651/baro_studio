export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="text-center">
                <h2 className="text-3xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    The page you requested does not exist or has been moved.
                    Please check that the address is correct.
                </p>
                <a
                    href="/"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    Return to Home
                </a>
            </div>
        </div >
    );
}