DROP TABLE `clients`;--> statement-breakpoint
DROP TABLE `shops`;--> statement-breakpoint
ALTER TABLE `users` ADD `birthday` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `address_id` int;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_address_id_address_id_fk` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE no action ON UPDATE no action;