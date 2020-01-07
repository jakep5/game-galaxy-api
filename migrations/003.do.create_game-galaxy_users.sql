CREATE TABLE "gamegalaxy_users" (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL
)

ALTER TABLE "gamegalaxy_games" 
    ADD COLUMN
        user_id INTEGER REFERENCES "gamegalaxy_users"(id)
        ON DELETE SET NULL;

ALTER TABLE "gamegalaxy_folders"
    ADD COLUMN
        user_id INTEGER REFERENCES "gamegalaxy_users"(id)
        ON DELETE SET NULL;
