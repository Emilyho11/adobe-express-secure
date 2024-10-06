"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@/components/ui/button";

export default function Login(props: any) {
	const { user, error, isLoading } = useUser();

	if (isLoading) return <div {...props}>Loading...</div>;

	return user ? (
		<a href="/api/auth/logout">
			<Button variant="destructive" {...props}>
				Sign Out
			</Button>
		</a>
	) : (
		<a href="/api/auth/login">
			<Button variant={"secondary"} {...props}>
				Login
			</Button>
		</a>
	);
}
