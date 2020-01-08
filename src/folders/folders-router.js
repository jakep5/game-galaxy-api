const express = require('express')
const BeersService = require('./folders-service')
const path = require('path')

const foldersRouter = express.Router();

const jsonBodyParser = express.json();

foldersRouter
    .route('/:user_id')
    .get((req, res, next) => {
        FoldersService.getUserFolders(
            req.app.get('db'),
            req.params.user_id
        )
        .then(folders => {
            res.json(folders.map(FoldersService.serializeFolder))
        })
        .catch(next)
})

foldersRouter
    .route('/')
    .post(jsonBodyParser, (req, res, next) => {
        const {name, user_id} = req.body;

        const newFolder = {name, user_id};

        
    })