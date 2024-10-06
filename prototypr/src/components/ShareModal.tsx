import React from "react";
import Modal from "./Modal";
import { LucidePlus, LucideX } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";

const ShareModal = ({ id }: { id: String | null }) => {
	const [closed, setClosed] = React.useState(false);
	const [emails, setEmails] = React.useState<String[]>([]);
	const [emailInput, setEmailInput] = React.useState("");

	// const emails = [
	// 	"lance.talban@mail.utoronto.ca",
	// 	"sample@gmail.com",
	// 	"frenchy.fry@ymail.ca",
	// ];

	React.useEffect(() => {
		axios.get(`/api/documents/${id}/share`).then((response) => {
			setEmails(response.data.shares || []);
		});
	}, []);

	const handleOnClick = () => {
		if (emailInput) {
			// Make a request to the server to add the email
			axios
				.post(`/api/documents/${id}/share`, {
					email: emailInput,
				})
				.then((response) => {
					setEmails([...emails, emailInput]);
				})
				.finally(() => {
					setEmailInput("");
				});
		}
	};

	if (closed) return null;
	if (!id) return null;

	return (
		<Modal
			onClose={(event) => {
				// Check if mouse target is the modal
				if (event.target === event.currentTarget) setClosed(true);
			}}
			className="w-[50vw] h-[50vh] flex flex-col"
		>
			<h1 className="text-2xl">Share</h1>
			<br />
			<ul className="space-y-2 relative flex-1">
				{emails.map((email) => {
					return (
						<li className="py-2 relative flex items-center justify-between px-4 border-t-2">
							<p>{email}</p>
							<LucideX />
						</li>
					);
				})}
			</ul>

			<div className="flex gap-4">
				<input
					type="text"
					value={emailInput}
					onChange={(event) => setEmailInput(event.target.value)}
					placeholder="Enter email"
					className="w-full text-lg bg-gray-100 p-2 border-2 border-gray-300"
				/>
				<div className="flex items-center">
					<Button
						type="submit"
						value="Add"
						className="w-fit bg-blue-500 text-white p-2 text-xl"
						onClick={handleOnClick}
					>
						<LucidePlus />
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ShareModal;
