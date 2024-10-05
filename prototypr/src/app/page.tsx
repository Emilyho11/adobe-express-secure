"use client";
import Image from "next/image";
import Login from "./login";
import { useUser } from "@auth0/nextjs-auth0/client";


export default function Home() {
  const {user, error, isLoading} = useUser();
  return (
    <main className="flex min-h-screen">
      <div className="w-[20vw] h-screen  bg-black p-2">
        
      </div>
        
      <div>
        <h1>Welcome, {user?.name}</h1>
        <Login/>
        </div>
    </main>
  );
}
