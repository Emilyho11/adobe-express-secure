import { NextApiRequest, NextApiResponse } from "next";
import { useParams } from "next/navigation";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
	const params = useParams();
	const { id } = params;
	if (!id) {
		res.status(400).json({ error: "ID is required" });
		return;
	}

	res.status(200).json({
		message: `Fetching comments for document with ID: ${id}`,
	});
}
