const xss = require('xss')
const bcrypt  = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    getUserWithUserName(db, user_name) {
        return db('gamegalaxy_users')
            .where({ user_name })
            .first()
            .then(user => !!user)
    },

    generateHashPassword(password) {
        return bcrypt.hash(password, 12)
    },

    putUserInDb(db, newUser) {
        return db
            .insert(newUser)
            .into('gamegalaxy_users')
            .returning('*')
            .then(([user]) => user)
    },

    serializeUser(user) {
        return {
            id: user.id,
            user_name: xss(user.user_name),
            date_created: new Date(user.date_created)
        }
    },

    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must have a length greater than 8 characters'
        }

        if (password.length > 72) {
            return 'Password must have a length less than 72 characters'
        }

        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with a space'
        }

        if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, 1 lower case, and 1 special character'
        }
    },

    setProfileUrl(db, url, userId) {
        return db
            .where('id', '=', parseInt(userId))
            .update({
                profileUrl: url
            })
    }
}

module.exports = UsersService