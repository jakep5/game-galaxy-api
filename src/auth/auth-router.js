const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();

const jsonBodyParser = express.json();

authRouter
    //Login method
    .post('/login', jsonBodyParser, (req, res, next) => {
        const {user_name, password} = req.body;

        const currentLoginUser = {user_name, password};

        for (const [key, value] of Object.entries(currentLoginUser))
            if (value == null) {
                return res.status(400).json({
                    error: `Request body is missing ${key}.`
                });
            };

            AuthService.getUserWithUserName(
                req.app.get('db'),
                currentLoginUser.user_name
            )
                .then(user => {
                    if(!user) {
                        return res.status(400).json({
                            error: 'Incorrect username and/or password',
                        })
                    }

                    return AuthService.comparePassword(currentLoginUser.password, user.password)
                        .then(comparedPair => {
                            if(!comparedPair)
                                return res.status(400).json({
                                    error: 'Incorrect username and/or password',
                                })
                                const sub = user.user_name;
                                const payload = { user_id: user.id };
                                res.send({
                                    authToken: AuthService.makeJwt(sub, payload)
                                });
                        });
                })
                .catch(next);
    });

module.exports = authRouter;