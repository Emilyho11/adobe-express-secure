import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dialect: "sqlite",
	driver: "d1-http",
	dbCredentials: {
		accountId: process.env.ACCOUNT_ID!,
		databaseId: process.env.D1_DATABASE_ID!,
		token: process.env.D1_TOKEN!,
	},
	verbose: true,
	strict: true,
});
