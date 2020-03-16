const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const testHelperObject = {
    makeGamesArray() {
        return [
            {
                id: 1,
                title: "Halo 4",
                igdb_id: 123,
                completed: "false",
                folder_id: 1,
                user_id: 1
            },
            {
                id: 2,
                title: "Halo 3",
                igdb_id: 124,
                completed: "false",
                folder_id: 1,
                user_id: 1
            },
            {
                id: 3,
                title: "Red Dead Redemption",
                igdb_id: 125,
                completed: "false",
                folder_id: 1,
                user_id: 1
            },
            {
                id: 4,
                title: "Super Smash Brothers Ultimate",
                igdb_id: 126,
                completed: "false",
                folder_id: 1,
                user_id: 1
            }
        ]
    },

    makeUsersArray() {
        return [
            {
                id: 1,
                user_name: "testuser",
                password: "!Testpassword1",
                date_created: new Date('2029-01-22T16:28:32.615Z')
            },
            {
                id: 2,
                user_name: "testuser2",
                password: "!Testpassword1",
                date_created: new Date('2029-01-22T16:28:32.615Z')
            }
        ]
    },

    makeFoldersArray() {
        return [
            {
                id: 1, 
                name: "test",
                user_id: 1
            },
            {
                id: 2,
                name: "test two",
                user_id: 1
            }
        ]
    },

    cleanTables(db) {
        return db.transaction(trx =>
            trx.raw(
                `TRUNCATE
                "gamegalaxy_games",
                "gamegalaxy_folders",
                "gamegalaxy_users"
                RESTART IDENTITY CASCADE`
            )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE "gamegalaxy_games_id_seq" minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE "gamegalaxy_folders_id_seq" minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('"gamegalaxy_games_id_seq"', 1)`),
                    trx.raw(`SELECT setval('"gamegalaxy_folders_id_seq"', 1)`),
                    trx.raw(`SELECT setval('"gamegalaxy_users_id_seq"', 1)`),
                ])
            )
        )
    },

    seedTestUsers(db, users) {
        const usersWithHash = users.map(user => ({
            ...user,
            password: bcrypt.hashSync(user.password, 1)
        }))
        return db.into('gamegalaxy_users').insert(usersWithHash)
            .then(() =>
                db.raw(
                    `SELECT setval('gamegalaxy_users_id_seq', ?)`,
                    [users[users.length - 1].id],
                ))
    },

    seedTestGames(db, users, games, folders) {
        return db.transaction(async trx => {
            await this.seedTestUsers(trx, users)
            await this.seedTestFolders(trx, folders)
            await trx.into('gamegalaxy_games').insert(games)
            await trx.raw(
                `SELECT setval('gamegalaxy_games', ?)`,
                [games[games.length - 1].id],
            )
        })
    },

    seedTestFolders(db, folders) {
        return db.transaction(async trx => {
            await trx.into('gamegalaxy_folders').insert(folders)
            await trx.raw(
                `SELECT setval('gamegalaxy_folders', ?)`,
                [folders[folders.length - 1].id],
            )
        })
    },

    makeAuthenticationHeader(user, secret=process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
            subject: user.user_name,
            algorithm: 'HS256'
        })
        return `Bearer ${token}`
    },

    makeExpectedGame(game) {
        return [
            {
                id: game.id,
                title: game.title,
                igdb_id: game.igdb_id,
                completed: game.completed,
                folder_id: game.folder_id
            }
        ]
    },

    makeExpectedFolder(folder) {
        return [
            {
                id: folder.id,
                name: folder.name
            }
        ]
    }

    
}

module.exports = testHelperObject;