BEGIN;

TRUNCATE
    "gamegalaxy_folders",
    "gamegalaxy_games",
    "gamegalaxy_users"
    RESTART IDENTITY CASCADE;

INSERT INTO "gamegalaxy_users" (id, user_name, password)
VALUES
    (1, 'testuser', 'testpassword');

INSERT INTO "gamegalaxy_folders" (id, name)
VALUES
    (1, 'Action'),
    (2, 'Adventure'),
    (3, 'Fantasy');

INSERT INTO "gamegalaxy_games" (title, completed)
VALUES
    ('The Legend of Zelda: Ocarina of Time', false),
    ('Super Mario Odyssey', false),
    ('Borderlands 3', false);

COMMIT;