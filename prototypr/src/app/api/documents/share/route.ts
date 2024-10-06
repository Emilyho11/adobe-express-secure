import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { drizzle } from "drizzle-orm/d1";
import { eq, and } from 'drizzle-orm';
import { docs } from "@/db/schema";

export const runtime = "edge";


export async function POST(request: NextRequest) {
    try {
        const { filename }: { filename: string } = await request.json();
        const session = await getSession();


        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const context = getRequestContext();
        const db = drizzle(context.env.DB);

        console.log("Document found:", docs.name, docs.owner);

        // Get the first matching document owned by the user
        const doc = await db.select()
            .from(docs)
            .where(
                and(
                    eq(docs.name, filename),
                    eq(docs.owner, session.user.email)
                )
            )
            .get();



        if (!doc) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }



        // Update the shared status
        const updatedDoc = await db.update(docs)
            .set({ shared: true })
            .where(eq(docs.docId, doc.docId))
            .returning()
            .get();

        return NextResponse.json(updatedDoc);

    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}