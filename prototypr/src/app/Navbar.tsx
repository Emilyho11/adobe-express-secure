"use client";
import React from "react";
import Image from "next/image";
import { LucideFolderDot, LucideHome, LucideShare } from "lucide-react";
import Login from "./login";
import { useUser } from "@auth0/nextjs-auth0/client";

const Navbar = () => {
	const { user, isLoading } = useUser();
	const navbarLinks: {
		[key: string]: {
			name: string;
			href: string;
			icon: JSX.Element;
		};
	} = {
		home: {
			name: "Home",
			href: "/",
			icon: <LucideHome />,
		},
		mydocuments: {
			name: "My Documents",
			href: "/documents",
			icon: <LucideFolderDot />,
		},
		shared: {
			name: "Shared",
			href: "/documents/shared",
			icon: <LucideShare />,
		},

		profile: {
			name: "Profile",
			href: "/profile",
			icon: <LucideHome />,
		},
	};
	return (
		<>
			<div
				className="w-[17vw] h-screen  bg-black p-4 py-16 relative"
				id="navpanel"
			>
				<br />
				<div className="my-4 flex gap-4 items-center">
					{user ? (
						<h3 className="text-xl">Logged in as, {user?.name}</h3>
					) : null}
					<Login />
				</div>
				<nav>
					<ul className="space-y-4">
						{Object.keys(navbarLinks).map((link) => {
							return (
								<li key={link} className="">
									<a
										href={navbarLinks[link].href}
										className="hover:text-blue-500 text-xl flex gap-2 items-center"
									>
										{navbarLinks[link].icon}
										{navbarLinks[link].name}
									</a>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</>
	);
};

export default Navbar;