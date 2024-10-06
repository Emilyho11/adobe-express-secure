import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse, type NextRequest } from "next/server";
import S3 from "@/lib/r2";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const command = new ListObjectsV2Command({
    Bucket: "https-secsuite-docs",
  });
  const files = await S3.send(command);
  return NextResponse.json(files.Contents);
}