"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/Card";
import {
	LucideDownload,
	LucideFileImage,
	LucideFileQuestion,
	LucideFileText,
	LucideMessageCircle,
	LucidePencil,
	LucideShare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Image from "next/image";
import ShareModal from "@/components/ShareModal";

const Page = () => {
	const [file, setFile] = useState<File | null>(null);
	const [fileUrl, setFileUrl] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [message, setMessage] = useState("");
	const [documents, setDocuments] = useState<
		{ id: number; name: string; url: string }[]
	>([]);

	const [shareId, setShareId] = useState<string | null>();

	const [selectedDocument, setSelectedDocument] = useState<string | null>();
	const [updatingDocument, setUpdatingDocument] = useState<string | null>();

	interface Response {
		data: {
			docId: number;
			name: string;
			folder: string;
		}[];
	}

	// Get all documents
	useEffect(() => {
		const fetchDocuments = async () => {
			try {
				const response: Response = await axios.get("/api/documents");
				const accId = "ff7c031cc454a7c324e821d0f6fa850d";
				const bucket = `https://${accId}.r2.cloudflarestorage.com/https-secsuite-docs/`;
				const docs = response.data.map((doc, i) => {
					return {
						url: bucket + doc.folder,
						name: doc.name,
						id: doc.docId,
					};
				});
				console.log(docs);
				setDocuments(docs);
			} catch (error) {
				console.error("Failed to get documents", error);
			}
		};

		fetchDocuments();
	}, []);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setFileUrl(URL.createObjectURL(selectedFile));
		}
	};

	const handleUpload = async () => {
		if (!file) {
			setMessage("No file selected");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		try {
			setUploading(true);
			const res = await axios.post("/api/documents/upload", {
				filename: file.name,
			});

			console.log(res.data);

			if (res.data) {
				const { url }: { url: string } = res.data;
				const uploadRes = await fetch(url, {
					method: "PUT",
					body: file,
				});
				console.log(uploadRes);
				if (uploadRes.ok) {
					setMessage("File Upload Successful!");
				} else {
					setMessage("File Upload Failed");
				}
			} else {
				setMessage("Pre-Sign URL error");
			}

			setMessage("File uploaded successfully");
			// Clear out form
			setFile(null);
			setFileUrl(null);

			setDocuments((prevDocuments) => [
				...prevDocuments,
				{ id: res.data.id, name: file.name, url: res.data.url },
			]);
		} catch (error) {
			setMessage("File upload failed");
		} finally {
			setUploading(false);
		}
	};

	const previewFile = async (docname: string) => {
		try {
			const response = await axios.post(
				"/api/documents/download",
				{ filename: docname },
				{ responseType: "blob" } // Important: set responseType to blob
			);

			// Create a blob from the response data
			const blob = new Blob([response.data], {
				type: response.headers["content-type"],
			});

			// Store the blob in a temporary URL
			const url = window.URL.createObjectURL(blob);

			// Display the file in an iframe
			const preview = document.getElementById(
				"preview"
			) as HTMLImageElement;

			if (preview) {
				preview.src = url;
			}
		} catch (error) {
			console.error("Error downloading file:", error);
			// Handle error appropriately - maybe show a notification to the user
			if (axios.isAxiosError(error)) {
				alert(`Failed to download file: ${error.message}`);
			} else {
				alert(
					"An unexpected error occurred while downloading the file"
				);
			}
		}
	};

	const downloadFile = async (docname: string) => {
		try {
			const response = await axios.post(
				"/api/documents/download",
				{ filename: docname },
				{ responseType: "blob" } // Important: set responseType to blob
			);

			// Create a blob from the response data

			const blob = new Blob([response.data], {
				type: response.headers["content-type"],
			});

			// Create a temporary URL for the blob
			const url = window.URL.createObjectURL(blob);

			// Create a temporary anchor element
			const link = document.createElement("a");
			link.href = url;

			// Get filename from Content-Disposition header if available
			const contentDisposition = response.headers["content-disposition"];
			const fileName = contentDisposition
				? contentDisposition.split("filename=")[1].replace(/["']/g, "")
				: docname;

			link.setAttribute("download", fileName);

			// Append to body, click, and clean up
			document.body.appendChild(link);
			link.click();

			// Clean up
			window.URL.revokeObjectURL(url);
			document.body.removeChild(link);
		} catch (error) {
			console.error("Error downloading file:", error);
			// Handle error appropriately - maybe show a notification to the user
			if (axios.isAxiosError(error)) {
				alert(`Failed to download file: ${error.message}`);
			} else {
				alert(
					"An unexpected error occurred while downloading the file"
				);
			}
		}
	};

	const handleDownload = () => {
		if (selectedDocument) {
			downloadFile(selectedDocument);
		} else {
			console.error("No document selected");
		}
	};

	const share = () => {
		const same_name = documents.find(
			(doc) => doc.name === selectedDocument
		);

		if (!same_name) {
			console.error("Document not found");
			return;
		}

		console.log("Sharing document:", same_name);

		setShareId(2);

		// Open a modal to share the document
	}

	return (
		<>
			<PanelGroup direction="horizontal">
				<Panel defaultSize={50} className="h-screen p-20 flex-1">
					<div
						style={{ textAlign: "center", marginBottom: "20px" }}
						className="flex items-center justify-evenly p-4 rounded-md"
					>
						<div className="flex flex-col items-center justify-center bg-gray-500 p-8 rounded-md w-2/3">
							<label className="flex flex-col gap-2">
								<input
									type="file"
									className="hidden"
									onChange={handleFileChange}
									id="file-input"
								/>
								<div className="flex-col flex-wrap gap-2 items-center justify-center">
									<button
										onClick={() => document.getElementById('file-input').click()}
										className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mx-auto text-balance"
										type="button"
									>
										Choose File
									</button>
									<div className="text-black break-all pt-4">
										{file?.name || 'No file chosen'}
									</div>
								</div>
							</label>
							<Button
								onClick={handleUpload}
								className="mt-10 bg-gray-100 text-black p-2  rounded-md"
								variant={"ghost"}
							>
								{uploading ? "Uploading..." : "Upload Document"}
							</Button>
						</div>

						<div
							style={{
								display:
									message.length > 0 || fileUrl
										? "block"
										: "none",
							}}
						>
							{message && <p>{message}</p>}
							{fileUrl && (
								<div className="mt-10 items-center flex justify-center ">
									{file?.type.startsWith("image/") && (
										<div className="">
											<p>Preview</p>
											<Image
												key={fileUrl}
												src={fileUrl}
												width={350}
												height={200}
												sizes="100vw"
												alt="Selected file"
												style={{
													maxWidth: "100%",
													maxHeight: "400px",
												}}
											/>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
					<h1 className="mt-10 mb-5 text-2xl text-center">
						View All Uploads
					</h1>
					<div className="w-full flex flex-wrap gap-4 justify-center">
						{documents.map((document_item) => {
							if (!document_item || !document_item.name) return;
							const extension = document_item.name.split(".").pop();

							const fileName = document_item.name
								.split(".")
								.slice(0, -1)
								.join(".");

							let icon = null;

							switch (extension) {
								case "pdf":
								case "docx":
									icon = <LucideFileText />;
									break;

								case "png":
								case "jpg":
								case "jpeg":
									icon = <LucideFileImage />;
									break;

								default:
									icon = <LucideFileQuestion />;
									break;
							}

							return (
								<button
									key={document_item.name}
									className=""
									onClick={() => {
										if (
											selectedDocument === document_item.name
										) {
											setSelectedDocument(null);
											// Clear the preview
											const preview = document.getElementById(
												"preview"
											) as HTMLImageElement;
											preview.src = "";

											return;
										}

										setSelectedDocument(document_item.name);
										// downloadFile(document.name)
										previewFile(document_item.name);
									}}
								>
									<Card
										key={document_item.id}
										// className="min-w-[15vw]  mb-5 p-5 relative"
										className={
											"w-full p-2 px-4 " +
											(selectedDocument === document_item.name
												? "!bg-blue-300"
												: "")
										}
									>
										<div className="flex gap-4 item-center">
											<div className="border-r-2 border-gray-400 pr-4">
												{icon}
												<p className="">{extension}</p>
											</div>
											<p className="text-center">
												{fileName}
											</p>
										</div>
									</Card>
								</button>
							);
						})}
					</div>
				</Panel>
				<PanelResizeHandle />
				<Panel defaultSize={50} className=" bg-black flex flex-col">
					<PanelGroup direction="vertical">
						<Panel
							defaultSize={70}
							maxSize={85}
							className="w-full border-b-2 border-red-800"
						>
							<iframe
								id="preview"
								src=""
								className="w-full h-full block ml-auto mr-auto"
							/>
						</Panel>
						<PanelResizeHandle />
						<Panel
							defaultSize={40}
							className="items-center flex flex-col justify-center gap-2 "
						>
							<h1>{selectedDocument}</h1>
							<div className="flex gap-4">
								<Button
									className="flex gap-4"
									variant={"secondary"}
									onClick={handleDownload}
								>
									<LucideDownload /> Download
								</Button>
								<Button
									className="flex gap-4"
									variant={"secondary"}
									onClick={(e) => share(e)}
								>
									<LucideShare /> Share
								</Button>
								<Button
									className="flex gap-4"
									variant={"secondary"}
								>
									<LucideMessageCircle /> Comments
								</Button>
							</div>
						</Panel>
					</PanelGroup>
				</Panel>
			</PanelGroup>
			{shareId && <ShareModal id={shareId} />}
		</>
	);
};

export default Page;
