"use client";
import LoginButton from "~/login-button";
import UserInfo from "~/user-info";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();
export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(document.cookie.includes("AUTH_TOKEN"))
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col gap-y-10 items-center mx-auto">
        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl text-gray-900 dark:text-white">Welcome to my
          page</h2>
        <LoginButton isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
        <UserInfo isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
      </div>
    </QueryClientProvider>
  );
}