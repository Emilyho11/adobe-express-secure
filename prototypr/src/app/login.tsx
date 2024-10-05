"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@/components/ui/button";

export default function Login() {

  const {user, error, isLoading} = useUser();

  if (isLoading) return <div>Loading...</div>;

  return user ? <a href="/api/auth/logout"><Button>Sign Out</Button></a>  : <a href="/api/auth/login"><Button variant={"secondary"}>Login</Button></a>;

}