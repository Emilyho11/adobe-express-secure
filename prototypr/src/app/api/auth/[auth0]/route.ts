import {
	getSession,
	handleAuth,
	handleCallback,
} from "@auth0/nextjs-auth0/edge";

export const runtime = "edge";

export const GET = handleAuth({
	async callback(req, res) {
		try {
			const response = await handleCallback(req, res);

			const sessionData = await getSession(req, res);
			if (!sessionData || !("user" in sessionData)) {
				return;
			}

			// const user = await db.user.findUnique({
			// if (!user) {
			// return;
			// }

			return response;
		} catch (error) {
			console.error(error);
		}
	},
});
