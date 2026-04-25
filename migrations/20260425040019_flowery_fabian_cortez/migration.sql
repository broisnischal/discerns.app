CREATE TABLE `bookmark` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`note` text,
	`category` text NOT NULL,
	`embedding` text NOT NULL,
	`embedding_model` text NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	CONSTRAINT `fk_bookmark_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `bookmark_user_id_idx` ON `bookmark` (`user_id`);--> statement-breakpoint
CREATE INDEX `bookmark_user_category_idx` ON `bookmark` (`user_id`,`category`);--> statement-breakpoint
CREATE INDEX `bookmark_user_created_at_idx` ON `bookmark` (`user_id`,`created_at`);