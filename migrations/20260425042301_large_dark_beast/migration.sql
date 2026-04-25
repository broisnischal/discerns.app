ALTER TABLE `bookmark` ADD `embedding_status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `bookmark` ADD `embedding_error` text;--> statement-breakpoint
ALTER TABLE `bookmark` ADD `embedded_at` integer;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_bookmark` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`note` text,
	`category` text NOT NULL,
	`embedding` text,
	`embedding_model` text,
	`embedding_status` text DEFAULT 'pending' NOT NULL,
	`embedding_error` text,
	`embedded_at` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	CONSTRAINT `fk_bookmark_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_bookmark`(`id`, `user_id`, `title`, `url`, `note`, `category`, `embedding`, `embedding_model`, `created_at`, `updated_at`) SELECT `id`, `user_id`, `title`, `url`, `note`, `category`, `embedding`, `embedding_model`, `created_at`, `updated_at` FROM `bookmark`;--> statement-breakpoint
DROP TABLE `bookmark`;--> statement-breakpoint
ALTER TABLE `__new_bookmark` RENAME TO `bookmark`;--> statement-breakpoint
UPDATE `bookmark`
SET
  `embedding_status` = CASE
    WHEN `embedding` IS NOT NULL AND `embedding_model` IS NOT NULL THEN 'ready'
    ELSE 'pending'
  END,
  `embedded_at` = CASE
    WHEN `embedding` IS NOT NULL AND `embedding_model` IS NOT NULL THEN `updated_at`
    ELSE NULL
  END;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `bookmark_user_id_idx` ON `bookmark` (`user_id`);--> statement-breakpoint
CREATE INDEX `bookmark_user_category_idx` ON `bookmark` (`user_id`,`category`);--> statement-breakpoint
CREATE INDEX `bookmark_user_created_at_idx` ON `bookmark` (`user_id`,`created_at`);