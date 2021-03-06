# Game Galaxy API

API implemented for use with Game Galaxy application. API gives the user the ability to login, authenticate, create folders, and search/save games to their profile. The coordination between this API and the Game Galaxy client allows users to create a profile with folders containing their saved games, and allows users to check games off when they are completed. the IGDB 3rd party API is utilized to allow the users to search their large database of games.

## Link to live application

https://game-galaxy.now.sh/

## API technologies

Node.js, Express.js and Express Router, JavaScript, PostgreSQL, Supertest, Knex.js

## Authentication

Authentication implemented utilizing JWT authentication. Users log in with username and password, and a user_id is assigned upon creation. Added folders and beers by each user are associated with the respective user's user_id.

## Base URL

https://gamegalaxyapi.herokuapp.com/

## GET - Games 

### Base URL + '/games'

Returns all beers associated with a user_id number, given in the request header. Response is an array of games in JSON format.

## POST - Game

### Base URL + '/games'

Posts a game to a database with information stored in game instance (received from IGDB server). Adds on associated user_id to request body, which is retrieved from session storage.

Example POST request format:
```json
{
  "title": "Halo 4",
  "igdb_id": "123",
  "completed": "false",
  "folder_id": "1",
  "user_id": "1"
}
```

## DELETE - Game

### Base URL + '/id/:gameId'

Deletes a game from the database, accessing the game via the game's ID property, passed via request parameter.

## PATCH - Game

### BASE URL + '/id/:gameId'

Updates a game's completed status to either true or false, depending on the value included in the request body. 

Example PATCH request body:
```json
{
  "completed": "true"
}
```

## GET - Folders

### Base URL + '/folders'

Retrieves all folders from the database associated with the user_id passed via the request headers.

## GET - Folder

### Base URL + '/folders/id/:folderId'

Gets a specific folder from the database. Folder is retrived via a unique folder ID, passed via request parameters. 

## POST - Folder

### Base URL + '/folders'

Posts a folder to the database. Adds user's associated user_id, retrieved from session storage.

Example POST request body:
```json
{
  "name": "Test Folder",
  "user_id": "1"
}
```

## DELETE - Folder

### Base URL + 'folders/id/:folderId'

Removes a folder from the database. Pinpoints a folder via the folder's unique ID, passed to the API via the request parameters.

## POST - User (user creation)

### Base URL + '/users'

Registers a user in the database. Users are assigned a unique user_id property upon creation in the database.

Example POST request body:
```json
{
  "user_name": "testuser",
  "password": "!Testpassword1"
}
```

## POST - User (user login)

### Base URL + '/auth/login'

Validates user's sign in input, attempts to match to values in the database. Input password is compared with hashed values in the database. If successful, JWT is created for the user's session and stored in browser's session storage.

Example POST request for login authentication:
```json
{
  "user_name": "testuser",
  "password": "!Testpassword1"
}
```


  

