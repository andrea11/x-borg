"use client"
import { useEffect } from "react";

type ErrorProps = {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex flex-col items-center mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 text-gray-900 dark:text-white">
      <h1>Something went wrong loading the page</h1>
      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  )
}