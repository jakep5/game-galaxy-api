CREATE TABLE "gamegalaxy_games" (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    igdb_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    completed boolean,
    folder_id INTEGER
        REFERENCES gamegalaxy_folders(id) ON DELETE CASCADE NOT NULL,
    date_published TIMESTAMP DEFAULT NOW() NOT NULL
);

ALTER TABLE "gamegalaxy_folders"
    ADD COLUMN
        games INTEGER REFERENCES "gamegalaxy_games"(id)
        ON DELETE SET NULL;