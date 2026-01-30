interface ErrorStateProps {
  title?: string;
  message?: string;
  reset?: () => void;
}

export default function ErrorState({
  title = "Something went wrong!",
  message = "An unexpected error occurred. Please try again later.",
  reset,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {message}
      </p>

      {reset && (
        <button
          onClick={reset}
          className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
