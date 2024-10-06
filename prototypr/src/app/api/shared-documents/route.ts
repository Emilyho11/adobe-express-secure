import { docs, shared } from "@/db/schema";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
interface DocumentResponse {
	owned: Array<{
		docId: number;
		name: string;
		version: number;
		shared: boolean;
		prefix: string;
	}>;
	sharedWithMe: Array<{
		docId: number;
		name: string;
		version: number;
		prefix: string;
	}>;
}
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getSession();
		if (!session?.user?.email) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}
		const context = getRequestContext();
		const db = drizzle(context.env.DB);

		// Get all documents owned by the user
		const ownedDocs = await db
			.select({
				docId: docs.docId,
				name: docs.name,
				version: docs.version,
				prefix: docs.owner,
			})
			.from(docs)
			.where(eq(docs.owner, session.user.email));

		// Get all documents shared with the user
		const sharedDocs = await db
			.select({
				docId: docs.docId,
				name: docs.name,
				version: docs.version,
				prefix: docs.owner,
				folder: docs.folder,
			})
			.from(docs)
			.innerJoin(shared, eq(shared.docId, docs.docId))
			.where(eq(shared.recipient, session.user.email));

		// console.log(sharedDocs);
		// const response: DocumentResponse = {
		// 	owned: ownedDocs.map((doc) => ({
		// 		...doc,
		// 		prefix: doc.prefix || session.user.email,
		// 	})),
		// 	sharedWithMe: sharedDocs.map((doc) => ({
		// 		...doc,
		// 		prefix: doc.prefix || "",
		// 	})),
		// };

		return NextResponse.json(sharedDocs);
	} catch (error) {
		console.error("Failed to fetch documents", error);
		return NextResponse.json(
			{ error: "Failed to fetch documents" },
			{ status: 500 }
		);
	}
}
