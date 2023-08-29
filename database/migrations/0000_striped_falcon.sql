CREATE TABLE `address` (
	`id` int AUTO_INCREMENT NOT NULL,
	`street` varchar(256) NOT NULL,
	`number` int NOT NULL,
	`neighborhood` varchar(256) NOT NULL,
	`city` varchar(256) NOT NULL,
	`state` varchar(256) NOT NULL,
	`country` varchar(256) NOT NULL,
	`zipcode` int,
	`lat` varchar(256),
	`long` varchar(256),
	`birthday` timestamp DEFAULT (now()),
	CONSTRAINT `address_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`birthday` timestamp,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`address_id` int NOT NULL,
	CONSTRAINT `shops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(256) NOT NULL,
	`hashPassword` varchar(256) NOT NULL,
	`phone_number` int,
	`photo_url` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `clients` ADD CONSTRAINT `clients_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shops` ADD CONSTRAINT `shops_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shops` ADD CONSTRAINT `shops_address_id_address_id_fk` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE no action ON UPDATE no action;