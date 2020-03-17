const knex = require('knex')
const app = require('../src/app')
const testHelperObject = require('./testHelperObject')

describe('games endpoints', function() {
    let db;

    const testGames = testHelperObject.makeGamesArray();
    const testFolders = testHelperObject.makeFoldersArray();
    const testUsers = testHelperObject.makeUsersArray();

    function makeAuthenticationHeader(user) {
        const token = Buffer.from(`${user.user_name}:${user.password}`).toString('base64');

        return `Bearer ${token}`
    }

    before('make knex instance for test database', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy())

    before('cleanup tables', () => testHelperObject.cleanTables(db))
    
    afterEach('cleanup tables', () => testHelperObject.cleanTables(db))


    describe(`GET /games/`, () => {
        context(`Given there are games and folders in the database`, () => {
            beforeEach('insert test games', () => {
                testHelperObject.seedTestGames(
                    db,
                    testUsers,
                    testGames,
                    testFolders
                )
            })

            it('Responds with corresponding games when valid username and password are supplied', () => {
                /* const expectedGame = testHelperObject.makeExpectedGame(
                    testGames[0]
                ) */

                return supertest(app)
                    .get(`/games`)
                    .set('Authorization', testHelperObject.makeAuthenticationHeader(testUsers[1]))
                    .set('user_id', 1)
                    .expect(200, testGames)
            })
        })

        context(`Given there are no games in the database corresponding to the user`, () => {
            beforeEach(() => 
                testHelperObject.seedTestUsers(db, testUsers)
            )
            it(`responds with no games`, () => {
                const userId = testUsers[0].id;
                return supertest(app)
                    .get(`/games`)
                    .set('Authorization', testHelperObject.makeAuthenticationHeader(testUsers[0]))
                    .set('user_id', 1)
                    .expect(res => {
                        expect(res.body == [])
                    })
            })
        })
    })

    describe(`POST /games`, () => {
        const testGames = testHelperObject.makeGamesArray();
        const testUsers = testHelperObject.makeUsersArray();
        const testFolders = testHelperObject.makeFoldersArray();

        beforeEach('insert test games', () => {
            testHelperObject.seedTestGames(
                db, 
                testUsers,
                testGames,
                testFolders
            )
        })

        it('creates a new game, responding with 201', function() {
            const newGame = {
                title: "Call of Duty 3",
                igdb_id: 156,
                completed: "false",
                folder_id: 1,
                user_id: 1
            }
            return supertest(app)
                .post('/games/')
                .set('Authorization', testHelperObject.makeAuthenticationHeader(testUsers[0]))
                .set('user_id', 1)
                .send(newGame)
                .expect(201)
        })

        it('responds with 400 when a field is missing', function() {
            const newGame = {
                igdb_id: 158,
                completed: false,
                folder_id: 1,
                user_id: 1
            }

            return supertest(app)
                .post('/games/')
                .set('Authorization', testHelperObject.makeAuthenticationHeader(testUsers[0]))
                .set('user_id', 1)
                .send(newGame)
                .expect(400)
        })
    })

    describe('DELETE /game/id/:gameId', () => {
        const testGames = testHelperObject.makeGamesArray();
        const testUsers = testHelperObject.makeUsersArray();
        const testFolders = testHelperObject.makeFoldersArray();

        beforeEach('insert test games', () => {
            testHelperObject.seedTestGames(
                db, 
                testUsers,
                testGames,
                testFolders
            )
        })

        it('deletes a game by providing game id to delete', () => {
            return supertest(app)
                .delete('/games/id/2')
                .set('Authorization', testHelperObject.makeAuthenticationHeader(testUsers[0]))
                .expect(204)
        })
    })
})
