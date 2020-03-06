const express = require('express')
const FoldersService = require('./folders-service')
const {requireAuthentication} = require('../middleware/jwtAuthentication')
const path = require('path')

const foldersRouter = express.Router();

const jsonBodyParser = express.json();

foldersRouter
    .route('/')
    .all(requireAuthentication)

    //Get user's folders
    .get((req, res, next) => {
        FoldersService.getUserFolders(
            req.app.get('db'),
            req.headers.user_id
        )
        .then(folders => {
            res.json(folders.map(FoldersService.serializeFolder))
        })
        .catch(next);
    })

    //Post folder to user's profile
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
                    .json(FoldersService.serializeFolder(folder))
            })
            .catch(next);
    })

foldersRouter
    .route('/:folderId')
    .all(requireAuthentication)

    //Get specific folder
    .get((req, res, next) => {
        FoldersService.getById(
            req.app.get('db'),
            req.params.folderId
        )
            .then(folder => {
                if (!folder) {
                    return res.status(404).json({
                        error: { message: `Folder does not exist`}
                    })
                }
                res.folder = folder;
                next();
            })
    })

    //Delete specific folder
    .delete((req, res, next) => {
        FoldersService.deleteById(
            req.app.get('db'),
            req.params.folderId
        )
            .then(res.status(204))
            return null;
})


module.exports = foldersRouter;