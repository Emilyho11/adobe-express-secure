import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse, type NextRequest } from "next/server";
import S3 from "@/lib/r2";
import { getSession } from "@auth0/nextjs-auth0/edge";

export const runtime = "edge";

interface DownloadRequest {
    filename: string;
    ownerEmail?: string; // Optional: if provided, will look in that user's directory
}

export async function POST(request: NextRequest) {
    try {
        const { filename, ownerEmail }: DownloadRequest = await request.json();
        const session = await getSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // If ownerEmail is provided, use it as prefix (for shared files)
        // Otherwise, use the current user's email
        const prefix = ownerEmail ? ownerEmail : session.user.email;
        const sanitizedPrefix = prefix.replace(/[^a-zA-Z0-9-_@.]/g, "_");
        const fullPath = `${sanitizedPrefix}/${filename}`;

        const command = new GetObjectCommand({
            Bucket: "https-secsuite-docs",
            Key: fullPath,
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
                doc: "application/msword",
                docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                xls: "application/vnd.ms-excel",
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                txt: "text/plain"
            }[parts[parts.length - 1].toLowerCase()];

            if (!ext) {
                return NextResponse.json(
                    { error: "Unsupported file type" },
                    { status: 400 }
                );
            }

            const arrayBuffer = await response.Body.transformToByteArray();

            // Create response with appropriate headers
            return new NextResponse(arrayBuffer, {
                headers: {
                    "Content-Disposition": `attachment; filename=${filename}`,
                    "Content-Type": ext,
                    "Cache-Control": "no-store"
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