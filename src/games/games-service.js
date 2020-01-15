const xss = require('xss');

const GamesService = {
    getAllGames(db) {
        return db
            .from('gamegalaxy_games AS game')
            .select(
                'game.id',
                'game.title',
                'game.igdb_id',
                'game.completed',
                'game.folder_id',
                'game.user_id'
            )
    },

    getUserGames(db, userId) {
        return GamesService.getAllGames(db)
        .where('user_id', userId)
    },

    deleteGame(db, id) {
        return db
            .from('gamegalaxy_games')
            .where({id})
            .delete()
    },

    insertGameIntoDb(knex, newGame) {
        return knex
            .insert(newGame)
            .into('gamegalaxy_games')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    serializeGame(game) {
        return {
            id: game.id,
            title: xss(game.title),
            igdb_id: game.igdb_id,
            completed: game.completed,
            folder_id: game.folder_id,
            user_id: game.user_id,
        }
    },
}

module.exports = GamesService;