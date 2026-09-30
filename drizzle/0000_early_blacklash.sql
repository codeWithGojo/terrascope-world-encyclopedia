CREATE TABLE `trip_briefs` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`destination` text NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`travelers` integer NOT NULL,
	`budget_minor` integer NOT NULL,
	`currency` text NOT NULL,
	`interests` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`itinerary` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_trip_briefs_owner_created` ON `trip_briefs` (`owner_id`,`created_at`);