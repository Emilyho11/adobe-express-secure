import { NextResponse, type NextRequest } from "next/server";
import { drizzle } from "drizzle-orm/d1";

interface Env {
	DB: D1Database;
}

export const runtime = "edge";

export async function GET(request: NextRequest, env: Env) {
	const db = drizzle(env.DB);
	console.log("hello");
	const data = await db.select().from(users).all();
	return NextResponse.json(data);
}
