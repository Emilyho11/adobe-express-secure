import { NextResponse, type NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { drizzle } from "drizzle-orm/d1";
import { docs, shared } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	if (!id) {
		return NextResponse.json({ error: "ID is required" }, { status: 400 });
	}

	const context = getRequestContext();
	const db = drizzle(context.env.DB);

	const document = await db
		.select()
		.from(docs)
		.where(eq(docs.docId, Number(id)))
		.get();

	if (!document) {
		return NextResponse.json(
			{ error: "Document not found" },
			{ status: 404 }
		);
	}

	// Check if user has permission to share document
	const session = await getSession();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	if (session.user.email !== document.owner) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const shares = await db
		.select()
		.from(shared)
		.where(eq(shared.docId, Number(id)))
		.get();

	return NextResponse.json({
		shares,
	});
}

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	if (!id) {
		return NextResponse.json({ error: "ID is required" }, { status: 400 });
	}

	const context = getRequestContext();
	const db = drizzle(context.env.DB);

	const document = await db
		.select()
		.from(docs)
		.where(eq(docs.docId, Number(id)))
		.get();

	if (!document) {
		return NextResponse.json(
			{ error: "Document not found" },
			{ status: 404 }
		);
	}

	// Check if user has permission to share document
	const session = await getSession();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	if (session.user.email !== document.owner) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// Check if the recipient already has access to the document
	const recipient = await req.json();

	if (!recipient || !recipient.email) {
		return NextResponse.json(
			{ error: "Recipient email is required" },
			{ status: 400 }
		);
	}

	const existingShare = await db
		.select()
		.from(shared)
		.where(
			and(
				eq(shared.recipient, recipient.email),
				eq(shared.docId, Number(id))
			)
		)
		.get();

	if (existingShare) {
		return NextResponse.json(
			{ error: "Recipient already has access to the document" },
			{ status: 400 }
		);
	}
	try {
		await db
			.insert(shared)
			.values({
				recipient: recipient.email,
				docId: id,
			})
			.execute();
		return NextResponse.json({
			message: "Document shared successfully",
		});
	} catch (error) {
		console.error("Failed to share document:", error);
		return NextResponse.json(
			{ error: "Failed to share document" },
			{ status: 500 }
		);
	}
}
