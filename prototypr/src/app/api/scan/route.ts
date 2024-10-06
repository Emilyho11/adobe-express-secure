import { OpenAI } from "openai";
import axios from "axios";

import { NextResponse, type NextRequest } from "next/server";

// const configuration = new Configuration({
// 	apiKey: process.env.OPENAI_API_KEY,
// });
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const model = "gpt-4o";

interface Scan {
	text: string;
}

export const runtime = "edge";

export async function POST(request: NextRequest) {
	console.log("HEJHEE");
	const req: Scan = await request.json();
	const text = req.text;

	if (!text) {
		return NextResponse.json(
			{ error: "Text is required" },
			{ status: 400 }
		);
	}

	try {
		// Use OpenAI to analyze the text for misinformation
		const response = await openai.chat.completions.create({
			model: model,
			messages: [
				{
					role: "system",
					content: `Analyze the following text for misinformation and provide a detailed report. Format it in JSON form:\n\n${text}\n\nReport:`,
				},
			],
			max_tokens: 500,
		});

		let analysis = response.choices[0].message.content;

		if (!analysis) {
			return NextResponse.json(
				{ error: "Failed to analyze text" },
				{ status: 500 }
			);
		}

		analysis = analysis.trim();

		// Cross-reference the text with credible databases
		const factCheckResponse = await openai.chat.completions.create({
			model: model,
			messages: [
				{
					role: "system",
					content: `Fact check the following text and provide a response that is more accurate:\n\n${text}. Give reliable sources that may give more information on the topic. Format in JSON form.`,
				},
			],
			max_tokens: 500,
		});

		const factCheckResults =
			factCheckResponse.choices[0].message.content?.trim();

		// Return the analysis results to the user
		return NextResponse.json({ analysis, factCheckResults });
	} catch (error) {
		console.error("Error analyzing text:", error);
		return NextResponse.json(
			{ error: "Failed to analyze text" },
			{ status: 500 }
		);
	}
}
