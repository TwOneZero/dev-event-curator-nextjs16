"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <ErrorState
        title="Oops! Could not load events."
        message="We encountered an issue loading the events. Please try refreshing the page."
        reset={reset}
      />
    </div>
  );
}
