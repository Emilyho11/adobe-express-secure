import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("Users", {
	userId: integer("userId").primaryKey({ autoIncrement: true }),
	email: text("email").notNull().unique(),
});

export const docs = sqliteTable("Docs", {
	docId: integer("docId").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	version: integer("version").notNull(),
	folder: text("folder"), // folder or prefix location
});

export const audit = sqliteTable("Audit", {
	actId: integer("actId").primaryKey({ autoIncrement: true }),
	action: text("action").notNull(),
	timestamp: integer("timestamp").default(sql`CURRENT_TIMESTAMP`), // Default to current timestamp
	ip_addr: text("ip_addr"), // To handle both IPv4 and IPv6
	docId: integer("docId").references(() => docs.docId),
	actor: integer("actor").references(() => users.userId),
	recipient: integer("recipient").references(() => users.userId),
});

export const shared = sqliteTable("Shared", {
	recipient: integer("recipient").references(() => users.userId),
	docId: integer("docId").references(() => docs.docId),
});

export const comments = sqliteTable("Comments", {
	commentId: integer("commentId").primaryKey({ autoIncrement: true }),
	docId: integer("docId").references(() => docs.docId),
	version: integer("version"),
	timestamp: integer("timestamp").default(sql`CURRENT_TIMESTAMP`), // Default to current timestamp
	userId: integer("userId").references(() => users.userId),
	text: text("text").notNull(),
});
