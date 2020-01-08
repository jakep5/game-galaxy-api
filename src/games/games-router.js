const express = require('express');
const GamesService = require('./games-service');
const path = require('path');

const gamesRouter = express.Router();

const jsonBodyParser = express.json();

gamesRouter
    .route('/:user_id')
    .get((req, res, next) => {
        GamesService.getUserGames(
            req.app.get('db'),
            req.params.user_id
        )
        .then(games => {
            res.json(games.map(GamesService.serializeGame));
        })
        .catch(next);
})

gamesRouter
    .route('/')
    .post(jsonBodyParser, (req, res, next) => {
        const {
            title,
            completed,
            user_id
        } = req.body;

        const newGame = {title, completed, user_id};

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

gamesRouter
    .route('/:gameId')
    .delete((req, res, next) => {
        GamesService.deleteGame(
            req.app.get('db'),
            req.params.gameId
        )
            .then(res.status(204))
            return null;
    })

module.exports = gamesRouter;