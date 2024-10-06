import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("Users", {
	email: text("email").primaryKey(),
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const docs = sqliteTable("Docs", {
	docId: integer("docId").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	// should default to 1
	version: integer("version").notNull(),
	folder: text("folder").notNull(),
	owner: text("owner").references(() => users.email),
});

export const audit = sqliteTable("Audit", {
	actId: integer("actId").primaryKey({ autoIncrement: true }),
	action: text("action").notNull(), // create, update, comment, modify (bumps version num), share, unshare - enum
	timestamp: integer("timestamp").default(sql`CURRENT_TIMESTAMP`), // Default to current timestamp
	ip_addr: text("ip_addr"), // To handle both IPv4 and IPv6
	docId: integer("docId").references(() => docs.docId),
	// the person performing the action of create, update, comment, modify, share and unshare
	actor: text("actor").references(() => users.email),
	// only for share and unshare actions
	recipient: text("recipient").references(() => users.email),
});

export const shared = sqliteTable("Shared", {
	recipient: text("recipient"),
	docId: integer("docId").references(() => docs.docId),
});

export const comments = sqliteTable("Comments", {
	commentId: integer("commentId").primaryKey({ autoIncrement: true }),
	docId: integer("docId").references(() => docs.docId),
	timestamp: integer("timestamp").default(sql`CURRENT_TIMESTAMP`), // Default to current timestamp
	user: text("user").references(() => users.email),
	text: text("text").notNull(),
});
