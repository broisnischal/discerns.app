PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `bookmark_category` (
  `id` text PRIMARY KEY,
  `user_id` text NOT NULL,
  `name` text NOT NULL,
  `created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
  `updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
  CONSTRAINT `fk_bookmark_category_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);--> statement-breakpoint
CREATE INDEX `bookmark_category_user_id_name_idx` ON `bookmark_category` (`user_id`,`name`);--> statement-breakpoint

INSERT INTO `bookmark_category` (`id`, `user_id`, `name`)
SELECT lower(hex(randomblob(16))), `id`, 'default'
FROM `user`
WHERE `id` NOT IN (
  SELECT `user_id` FROM `bookmark_category`
);--> statement-breakpoint

INSERT INTO `bookmark_category` (`id`, `user_id`, `name`)
SELECT lower(hex(randomblob(16))), `user_id`, lower(`category`)
FROM `bookmark`
WHERE lower(`category`) NOT IN (
  SELECT `name` FROM `bookmark_category` bc WHERE bc.`user_id` = `bookmark`.`user_id`
);--> statement-breakpoint

CREATE TABLE `__new_bookmark` (
  `id` text PRIMARY KEY,
  `user_id` text NOT NULL,
  `url` text NOT NULL,
  `note` text,
  `tag` text NOT NULL,
  `category_id` text NOT NULL,
  `embedding` text,
  `embedding_model` text,
  `embedding_status` text DEFAULT 'pending' NOT NULL,
  `embedding_error` text,
  `embedded_at` integer,
  `created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
  `updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
  CONSTRAINT `fk_bookmark_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bookmark_category_id_bookmark_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `bookmark_category`(`id`) ON DELETE CASCADE
);--> statement-breakpoint

INSERT INTO `__new_bookmark` (`id`, `user_id`, `url`, `note`, `tag`, `category_id`, `embedding`, `embedding_model`, `embedding_status`, `embedding_error`, `embedded_at`, `created_at`, `updated_at`)
SELECT
  b.`id`,
  b.`user_id`,
  b.`url`,
  b.`note`,
  lower(b.`category`),
  bc.`id`,
  b.`embedding`,
  b.`embedding_model`,
  b.`embedding_status`,
  b.`embedding_error`,
  b.`embedded_at`,
  b.`created_at`,
  b.`updated_at`
FROM `bookmark` b
JOIN `bookmark_category` bc
  ON bc.`user_id` = b.`user_id`
 AND bc.`name` = lower(b.`category`);--> statement-breakpoint

DROP TABLE `bookmark`;--> statement-breakpoint
ALTER TABLE `__new_bookmark` RENAME TO `bookmark`;--> statement-breakpoint
CREATE INDEX `bookmark_user_id_idx` ON `bookmark` (`user_id`);--> statement-breakpoint
CREATE INDEX `bookmark_user_tag_idx` ON `bookmark` (`user_id`,`tag`);--> statement-breakpoint
CREATE INDEX `bookmark_user_category_id_idx` ON `bookmark` (`user_id`,`category_id`);--> statement-breakpoint
CREATE INDEX `bookmark_user_created_at_idx` ON `bookmark` (`user_id`,`created_at`);--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
-- Custom SQL migration file, put your code below! --