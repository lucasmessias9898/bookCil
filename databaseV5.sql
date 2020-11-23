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
  "machine_id" int,
  "description" text,
  "periodicidade" int,
  "horimetro_ultima" int,
  "horimetro_proxima" int,
  "supervisor_id" int,
  "status" int,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "idambev" text UNIQUE,
  "name" text,
  "nivel" int,
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

CREATE TABLE "machines" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "tag" text,
  "area_id" int,
  "horimetro" int,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "activitiesdones" (
  "id" SERIAL PRIMARY KEY,
  "activity_id" int,
  "horimetroexec" int,
  "gaphorimetro" int,
  "idfuncionario" text,
  "nomefuncionario" text,
  "observation" text,
  "created_at" timestamp
);

ALTER TABLE "files" ADD FOREIGN KEY ("activity_id") REFERENCES "activities" ("id");

ALTER TABLE "activities" ADD FOREIGN KEY ("area_id") REFERENCES "areas" ("id");

ALTER TABLE "activities" ADD FOREIGN KEY ("machine_id") REFERENCES "machines" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("position_id") REFERENCES "positions" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("area_id") REFERENCES "areas" ("id");

ALTER TABLE "activities" ADD FOREIGN KEY ("supervisor_id") REFERENCES "users" ("id");

ALTER TABLE "machines" ADD FOREIGN KEY ("area_id") REFERENCES "areas" ("id");

ALTER TABLE "activitiesdones" ADD FOREIGN KEY ("activity_id") REFERENCES "activities" ("id");

-- function to get timestamp now in column updated_at
CREATE FUNCTION trigger_set_timestamp_updated()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_update_at
BEFORE UPDATE ON activities
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp_updated();

CREATE TRIGGER set_timestamp_update_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp_updated();

CREATE TRIGGER set_timestamp_update_at
BEFORE UPDATE ON machines
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp_updated();

-- function to get timestamp now in column created_at
CREATE FUNCTION trigger_set_timestamp_created()
RETURNS TRIGGER AS $$
BEGIN
	NEW.created_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_created_at
BEFORE INSERT ON activities
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp_created();

CREATE TRIGGER set_timestamp_created_at
BEFORE INSERT ON machines
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp_created();

CREATE TRIGGER set_timestamp_created_at
BEFORE INSERT ON activitiesdones
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp_created();

-- connect pg simple table
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");