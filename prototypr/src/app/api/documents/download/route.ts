import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse, type NextRequest } from "next/server";
import S3 from "@/lib/r2";

export const runtime = "edge";

export async function POST(request: NextRequest) {
	try {
		const { filename }: { filename: string } = await request.json();

		const command = new GetObjectCommand({
			Bucket: "https-secsuite-docs",
			Key: filename,
		});

		try {
			const response = await S3.send(command);

			if (!response.Body) {
				return NextResponse.json(
					{ error: "Object Not Found" },
					{ status: 404 }
				);
			}

			const parts = filename.split(".");
			const ext: string | undefined = {
				pdf: "application/pdf",
				jpg: "image/jpeg",
				jpeg: "image/jpeg",
				png: "image/png",
				gif: "image/gif",
			}[parts[parts.length - 1].toLowerCase()];

			if (!ext) {
				return NextResponse.json(
					{ error: "Unsupported file type" },
					{ status: 400 }
				);
			}

			// Convert the readable stream to ArrayBuffer
			const arrayBuffer = await response.Body.transformToByteArray();

			// Create response with appropriate headers
			return new NextResponse(arrayBuffer, {
				headers: {
					"Content-Disposition": `attachment; filename=${filename}`,
					"Content-Type": ext,
					"Cache-Control": "no-store",
				},
			});
		} catch (error) {
			console.error("Error retrieving file from R2:", error);
			return NextResponse.json(
				{ error: "Failed to retrieve file" },
				{ status: 500 }
			);
		}
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid request body" },
			{ status: 400 }
		);
	}
}
