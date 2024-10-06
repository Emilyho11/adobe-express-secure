CREATE TABLE `Audit` (
	`actId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`action` text NOT NULL,
	`timestamp` integer DEFAULT CURRENT_TIMESTAMP,
	`ip_addr` text,
	`docId` integer,
	`actor` integer,
	`recipient` integer,
	FOREIGN KEY (`docId`) REFERENCES `Docs`(`docId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor`) REFERENCES `Users`(`userId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recipient`) REFERENCES `Users`(`userId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Comments` (
	`commentId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`docId` integer,
	`version` integer,
	`timestamp` integer DEFAULT CURRENT_TIMESTAMP,
	`userId` integer,
	`text` text NOT NULL,
	FOREIGN KEY (`docId`) REFERENCES `Docs`(`docId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Docs` (
	`docId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`version` integer NOT NULL,
	`folder` text
);
--> statement-breakpoint
CREATE TABLE `Shared` (
	`recipient` integer,
	`docId` integer,
	FOREIGN KEY (`recipient`) REFERENCES `Users`(`userId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`docId`) REFERENCES `Docs`(`docId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`userId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Users_email_unique` ON `Users` (`email`);