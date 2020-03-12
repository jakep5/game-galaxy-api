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
    }
}