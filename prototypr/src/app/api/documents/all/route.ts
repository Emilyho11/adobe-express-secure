import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse, type NextRequest } from "next/server";
import { drizzle } from 'drizzle-orm/d1';
import { docs, shared } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@auth0/nextjs-auth0';

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

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const context = getRequestContext();
        const db = drizzle(context.env.DB);

        // Get all documents owned by the user
        const ownedDocs = await db.select({
            docId: docs.docId,
            name: docs.name,
            version: docs.version,
            shared: docs.shared,
            prefix: docs.owner,
        })
            .from(docs)
            .where(eq(docs.owner, session.user.email));

        // Get all documents shared with the user
        const sharedDocs = await db.select({
            docId: docs.docId,
            name: docs.name,
            version: docs.version,
            prefix: docs.owner,
        })
            .from(docs)
            .innerJoin(shared, eq(shared.docId, docs.docId))
            .where(eq(shared.recipient, session.user.email));

        const response: DocumentResponse = {
            owned: ownedDocs.map(doc => ({
                ...doc,
                prefix: doc.prefix || session.user.email
            })),
            sharedWithMe: sharedDocs.map(doc => ({
                ...doc,
                prefix: doc.prefix || ''
            }))
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json(
            { error: "Failed to fetch documents" },
            { status: 500 }
        );
    }
}