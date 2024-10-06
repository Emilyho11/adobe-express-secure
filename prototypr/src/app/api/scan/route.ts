import { OpenAI } from "openai";
import axios from "axios";
import * as fs from "fs";
import { IncomingForm } from "formidable";
import { NextResponse, type NextRequest } from "next/server";

// const configuration = new Configuration({
// 	apiKey: process.env.OPENAI_API_KEY,
// });
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const model = "gpt-4o";
// const assistant = openai.beta.assistants.create({
// 	name: "Fact Checker",
// 	instructions:
// 		"You are a fact checker. Analyze the following text for misinformation and provide a simple report. Format it in JSON form.",
// 	model: model,
// 	tools: [{ type: "file_search" }],
// });
// async function encodeImageToBase64(filePath: File): string {
// 	try {
// 		// Read file and convert to base64
// 		// const imageData = fs.readFileSync(filePath);
// 		const res = Buffer.from(await filePath.arrayBuffer()).toString(
// 			"base64"
// 		);
// 		return res;
// 	} catch (error) {
// 		console.error(`Error reading file at ${filePath}:`, error);
// 		return "";
// 	}
// }

export async function POST(request: NextRequest) {
	// const { text } = await request.json();
	// const { image } = await request.json();
	const data = request.body;
	const content = await request.formData();
	const text = content.get("text");
	const image = content.get("image");

	if (!text) {
		return NextResponse.json(
			{ error: "Text is required" },
			{ status: 400 }
		);
	}

	let imageToTextAnalysis = null;

	if (image != null) {
		try {
			// Use OpenAI to analyze the image and extract text

			const message_file = await openai.files.create({
				purpose: "assistants",
				file: new File([image], "image.pdf"),
			});

			const thread = await openai.beta.threads.create();
			// Wait for the assistant to be created
			const assistant = await openai.beta.assistants.create({
				name: "Fact Checker",
				instructions:
					"You are a fact checker. Analyze the following text for misinformation and provide a simple report. Format it in JSON form.",
				model: model,
				tools: [{ type: "file_search" }],
			});

			const myMessage = await openai.beta.threads.messages.create(
				thread.id,
				{
					role: "user",
					content: `Analyze the following image and extract any text and describe the image:\n`,
					attachments: [
						{
							file_id: message_file.id,
							tools: [{ type: "file_search" }],
						},
					],
				}
				// max_tokens: 500,
			);

			// Now poll
			const run = await openai.beta.threads.runs.createAndPoll(
				thread.id,
				{
					assistant_id: assistant.id,
				}
			);

			// Read out the response
			console.log(run);
			if (run.status == "completed") {
				const messages = openai.beta.threads.messages.list(thread.id);
				console.log(messages);
			} else {
				console.log(run.status);
			}
			// Handle the response here
			// imageToTextAnalysis =
			// 	imageToTextResponse.choices[0].message.content;

			// if (!imageToTextAnalysis) {
			// 	return NextResponse.json(
			// 		{ error: "Failed to analyze image" },
			// 		{ status: 500 }
			// 	);
			// }
		} catch (error) {
			console.error("Error analyzing image:", error);
			return NextResponse.json(
				{ error: "Failed to analyze image" },
				{ status: 500 }
			);
		}
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
		return NextResponse.json({
			analysis,
			factCheckResults,
			imageToTextAnalysis,
		});
	} catch (error) {
		console.error("Error analyzing text:", error);
		return NextResponse.json(
			{ error: "Failed to analyze text" },
			{ status: 500 }
		);
	}
}
