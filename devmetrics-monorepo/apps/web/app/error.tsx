'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-8">
      <h2 className="text-xl font-bold mb-4 text-red-500">Error Caught by Boundary!</h2>
      <div className="bg-black text-left text-red-400 p-4 rounded-lg overflow-auto max-w-4xl w-full font-mono text-sm mb-8 whitespace-pre-wrap">
        <p className="font-bold mb-2">{error.name}: {error.message}</p>
        <p>{error.stack}</p>
      </div>
      <button
        onClick={() => reset()}
        className="btn-primary"
      >
        Try again
      </button>
    </div>
  );
}
