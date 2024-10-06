import { NextResponse, type NextRequest } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	if (!id) {
		return NextResponse.json({ error: "ID is required" }, { status: 400 });
	}

	// Check if the user owns the document

	return NextResponse.json({
		message: `Fetching comments for document with ID: ${id}`,
	});
}
