import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";
import S3 from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { drizzle } from "drizzle-orm/d1";
import { docs } from "@/db/schema";

export const runtime = "edge";

export async function POST(request: NextRequest) {
	try {
		const {
			filename,
			versionNum,
		}: { filename: string; versionNum: number } = await request.json();
		const session = await getSession();

		if (!session?.user?.email) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Sanitize email for use in path
		const sanitizedEmail = session.user.email.replace(
			/[^a-zA-Z0-9-_@.]/g,
			"_"
		);
		const prefixedFilename = `${sanitizedEmail}/${filename}`;
		const context = getRequestContext();
		const db = drizzle(context.env.DB);

		const url = await getSignedUrl(
			S3,
			new PutObjectCommand({
				Bucket: "https-secsuite-docs",
				Key: prefixedFilename,
				// Optionally add metadata to track file ownership
				Metadata: {
					owner: sanitizedEmail,
				},
			}),
			{
				expiresIn: 600,
			}
		);

		// Insert document record
		const newDoc = await db
			.insert(docs)
			.values({
				name: filename,
				version: versionNum || 1, // Default to version 1 for new documents
				owner: session.user.email,
				folder: prefixedFilename,
			})
			.returning()
			.get();

		return Response.json({ url, prefixedFilename });
	} catch (error: any) {
		return Response.json({ error: error.message }, { status: 500 });
	}
}
