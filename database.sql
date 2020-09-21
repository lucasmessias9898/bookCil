CREATE TABLE "areas" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "status" int
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text,
  "activity_id" int
);

CREATE TABLE "activities" (
  "id" SERIAL PRIMARY KEY,
  "area_id" int,
  "equipamento" text,
  "tag" text,
  "description" text,
  "periodicidade" int,
  "supervisor_id" int,
  "status" int,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "idambev" text UNIQUE,
  "name" text,
  "nivel" text,
  "area_id" int,
  "position_id" int,
  "status" int,
  "password" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "positions" (
  "id" SERIAL PRIMARY KEY,
  "name" text
);

ALTER TABLE "files" ADD FOREIGN KEY ("activity_id") REFERENCES "activities" ("id");

ALTER TABLE "activities" ADD FOREIGN KEY ("area_id") REFERENCES "areas" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("position_id") REFERENCES "positions" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("area_id") REFERENCES "areas" ("id");

ALTER TABLE "activities" ADD FOREIGN KEY ("supervisor_id") REFERENCES "users" ("id");

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

-- connect pg simple table
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");