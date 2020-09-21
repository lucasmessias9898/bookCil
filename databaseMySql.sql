CREATE TABLE `areas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` text,
  `status` int
);

CREATE TABLE `files` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` text,
  `path` text,
  `activity_id` int
);

CREATE TABLE `activities` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `area_id` int,
  `equipamento` text,
  `tag` text,
  `description` text,
  `periodicidade` int,
  `supervisor_id` int,
  `status` int,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `idambev` text UNIQUE,
  `name` text,
  `nivel` text,
  `area_id` int,
  `position_id` int,
  `status` int,
  `password` text,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `positions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` text
);

CREATE TABLE `maquinas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` text,
  `area_id` int,
  `horimetro` int,
  `created_at` timestamp,
  `updated_at` timestamp
);

ALTER TABLE `files` ADD FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`);

ALTER TABLE `activities` ADD FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`);

ALTER TABLE `users` ADD FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`);

ALTER TABLE `users` ADD FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`);

ALTER TABLE `activities` ADD FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`);

ALTER TABLE `maquinas` ADD FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`);

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON activities
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();