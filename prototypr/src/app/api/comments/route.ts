import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse, type NextRequest } from "next/server";
import { drizzle } from "drizzle-orm/d1";
import { comments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@auth0/nextjs-auth0/edge";

export const runtime = "edge";

// Get all comments for a document
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const docId = parseInt(searchParams.get("docId") || "");

        if (!docId) {
            return NextResponse.json(
                { error: "Missing document ID" },
                { status: 400 }
            );
        }

        const context = getRequestContext();
        const db = drizzle(context.env.DB);

        const documentComments = await db.select()
            .from(comments)
            .where(eq(comments.docId, docId))
            .orderBy(comments.timestamp);
        
        console.log("Comments:", documentComments);
        

        return NextResponse.json(documentComments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

interface Comment {
    docId: number;
    text: string;
}

// Add a new comment
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { docId, text }: Comment = await request.json();

        if (!docId || !text) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const context = getRequestContext();
        const db = drizzle(context.env.DB);

        const newComment = await db.insert(comments)
            .values({
                docId,
                user: session.user.email,
                text
            })
            .returning()
            .get();

        return NextResponse.json(newComment);
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json(
            { error: "Failed to add comment" },
            { status: 500 }
        );
    }
}