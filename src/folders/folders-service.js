const xss = require('xss');

const FoldersService = {
    getAllFolders(db) {
        return db
            .from('gamegalaxy_folders AS folder')
            .select(
                'folder.id',
                'folder.name',
                'folder.user_id'
            )
    },

    getUserFolders(db, userId) {
        return FoldersService.getAllFolders(db)
        .where('user_id', userId)
    },

    deleteFolder(db, id) {
        return db
            .from('gamegalaxy_folders')
            .where({id})
            .delete()
    },

    serializeFolder(folder) {
        return {
            id: folder.id,
            name: xss(folder.name)
        }
    },

    insertFolderIntoDb(knex, newFolder) {
        return knex
            .insert(newFolder)
            .into('gamegalaxy_folders')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = FoldersService;