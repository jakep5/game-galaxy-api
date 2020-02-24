const express = require('express')
const UsersService = require('./users-service')
const path = require('path')

const usersRouter = express.Router();

const jsonBodyParser = express.json();

usersRouter
    .route('/')
    .post(jsonBodyParser, (req, res, next) => {
        const { password, user_name } = req.body;

        for (const field of ['user_name', 'password'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `${field} is required`
                })

        let passwordError = UsersService.validatePassword(password)

        if(passwordError) {
            return res.status(400).json({
                error: passwordError
            })
        }

        UsersService.getUserWithUserName(
            req.app.get('db'),
            user_name
        )
            .then(getUserWithUserName => {
                if (getUserWithUserName)
                    return res.status(400).json({
                        error: `Username has already been taken, please choose another`
                })

                return UsersService.generateHashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            user_name,
                            password: hashedPassword,
                            date_created: 'now()',
                        }

                        return UsersService.putUserInDb(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                            })
                    })
            })
            .catch(next);
    })
    .patch((req, res, next) => {
        const { profileUrl, userId } = req.body;

        if (!req.body[profile]) {
            return res.status(400).json({
                error: `Must include profile url`
            })
        };

        UsersService.setProfileUrl(
            req.app.get('db'),
            profileUrl,
            userId
        )
            .then(url => {
                res
                    .status(204)
                    .json(url)
            })
    })

module.exports = usersRouter