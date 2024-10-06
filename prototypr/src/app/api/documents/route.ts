import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse, type NextRequest } from "next/server";
import S3 from "@/lib/r2";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { docs, users } from "@/db/schema";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  let session;

  try {
    session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500 }
    );
  }

  // Sanitize email for use in path
  const sanitizedEmail = session.user.email.replace(/[^a-zA-Z0-9-_@.]/g, "_");

  const context = getRequestContext();
  const db = drizzle(context.env.DB);

  // Check if user exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .get();

  if (!existingUser) {
    await db
      .insert(users)
      .values({
        email: session.user.email,
      })
      .execute();

    console.log(`User ${session.user.email} added to database`);
  }

  // const command = new ListObjectsV2Command({
  // 	Bucket: "https-secsuite-docs",
  // 	Prefix: sanitizedEmail + "/",
  // });
  // const files = await S3.send(command);

  // if (!files.Contents) {
  // 	return NextResponse.json({ error: "No files found" }, { status: 404 });
  // }

  // strip out the email prefix
  // const fileNames = files.Contents.map((file) => {
  // 	return {
  // 		Key: file?.Key?.replace(sanitizedEmail + "/", ""),
  // 	};
  // });

  const documents = await db
    .select()
    .from(docs)
    .where(eq(docs.owner, session.user.email));


  if (!documents) {
    return NextResponse.json([]);
  }

  // Wrap documents as an array if it's not already
  if (!Array.isArray(documents)) {
    return NextResponse.json([documents]);
  }
  return NextResponse.json(documents);
}
