// import { NextApiRequest, NextApiResponse } from "next";
// // import { useParams } from "next/navigation";

// export async function GET(req: NextApiRequest, res: NextApiResponse) {
// 	const params = useParams();
// 	const { id } = params;
// 	if (!id) {
// 		res.status(400).json({ error: "ID is required" });
// 		return;
// 	}

// 	res.status(200).json({
// 		message: `Fetching comments for document with ID: ${id}`,
// 	});
// }
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";

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
