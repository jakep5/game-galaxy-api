const express = require('express');
const GamesService = require('./games-service');
const {requireAuthentication} = require('../middleware/jwtAuthentication');
const path = require('path');

const gamesRouter = express.Router();

const jsonBodyParser = express.json();

gamesRouter
    .route('/')
    .all(requireAuthentication)

    //Add game to user profile
    .post(jsonBodyParser, (req, res, next) => {
        const {
            title,
            igdb_id,
            completed,
            folder_id,
            user_id
        } = req.body;

        const newGame = {title, igdb_id, completed, folder_id, user_id};

        for (const [key, value] of Object.entries(newGame)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body, please include it`}
                })
            }
        }
        
        GamesService.insertGameIntoDb(
            req.app.get('db'),
            newGame
        )
            .then(game => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl + `/${game.id}`))
                    .json(GamesService.serializeGame(game))
            })
            .catch(next);
    })

    //Get User's Games
    .get((req, res, next) => {
        GamesService.getUserGames(
            req.app.get('db'),
            req.header.user_id
    )
    .then(games => {
        res.json(games.map(GamesService.serializeGame));
    })
    .catch(next);
    })
    

gamesRouter
    .route('/:gameId')
    .all(requireAuthentication)

    //Delete game from user's profile
    .delete((req, res, next) => {
        GamesService.deleteGame(
            req.app.get('db'),
            req.params.gameId
        )
            .then(res.status(204))
            return null;
    })

    //Update game as completed
    .patch((req, res, next) => {
        GamesService.toggleCompleted(
            req.app.get('db'),
            req.params.gameId,
            req.body
        )
            .then(res.status(204))
    })

module.exports = gamesRouter;