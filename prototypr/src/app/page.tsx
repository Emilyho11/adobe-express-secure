"use client";
import Login from "./login";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LucideFolderDot, LucideHome } from "lucide-react";

export default function Home() {
	const { user, error, isLoading } = useUser();

	return (
		<div className="p-2 flex flex-col w-full items-center justify-center">
			{user && <h1 className="text-3xl">Welcome, {user?.name}</h1>}
			<section className="prose lg:prose-xl !text-white">
				<h1 className="!text-white">Hello,</h1>
				<p>
					Our Adobe Express add-on boosts security by automatically
					watermarking sensitive designs, encrypting file transfers
					with PGP, and flagging data privacy risks.
				</p>
				<p>
					It also uses AI to scan for misinformation,
					cross-referencing credible databases, and alerts users to
					potential false claims, suggesting reliable sources for
					verification.
				</p>
			</section>

			<Login className="p-4 mt-4 scale-125" />
		</div>
	);
}
