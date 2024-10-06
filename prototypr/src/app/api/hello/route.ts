import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse, type NextRequest } from "next/server";
import { getDocs } from "@/lib/actions";
import { drizzle } from "drizzle-orm/d1";
import { docs } from "@/db/schema";

export const runtime = "edge";

export async function GET(request: NextRequest) {
	try {
		const context = getRequestContext();
		const db = drizzle(context.env.DB);

		// Fetch all rows from the Docs table
		const allDocs = await db.select().from(docs);

		return NextResponse.json(allDocs);
	} catch (error) {
		console.error("Database query error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch documents" },
			{ status: 500 }
		);
	}
}

interface Document {
	name: string;
	version: number;
	folder?: string;
}

// POST endpoint to insert a new document
export async function POST(request: NextRequest) {
	try {
		const body: Document = await request.json();
		const { name, version, folder } = body;

		// Validate required fields
		if (!name || version === undefined) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const context = getRequestContext();
		const db = drizzle(context.env.DB);

		// Insert new document
		const result = await db
			.insert(docs)
			.values({
				name,
				version,
				folder,
			})
			.returning();

		return NextResponse.json(result[0]);
	} catch (error) {
		console.error("Database insert error:", error);
		return NextResponse.json(
			{ error: "Failed to insert document" },
			{ status: 500 }
		);
	}
}
