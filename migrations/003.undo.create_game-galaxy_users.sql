ALTER TABLE 'gamegalaxy_games'
    DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS gamegalaxy_users;

ALTER TABLE 'gamegalaxy_folders'
    DROP COLUMN IF EXISTS user_id;