const express = require('express')
const BeersService = require('./folders-service')
const {requireAuthentication} = require('../middleware/jwtAuthentication')
const path = require('path')

const foldersRouter = express.Router();

const jsonBodyParser = express.json();

foldersRouter
    .route('/:user_id')
    .all(requireAuthentication)
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
    .all(requireAuthentication)
    .post(jsonBodyParser, (req, res, next) => {
        const {name, user_id} = req.body;

        const newFolder = {name, user_id};

        for (const [key, value] of Object.entries(newFolder)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body, please include it` }
                })
            }
        }

        FoldersService.insertFolderIntoDb(
            req.app.get('db'),
            newFolder
        )
            .then(folder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(FolderService.serializeFolder(folder))
            })
            .catch(next);
})

foldersRouter
    .route('/:folderId')
    .all(requireAuthentication)
    .delete((req, res, next) => {
        FoldersService.deleteFolder(
            req.app.get('db'),
            req.params.folderId
        )
            .then(res.status(204))
            return null;
})

module.exports = foldersRouter;