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
    
    describe(`Protected endpoints`, () => {
        beforeEach('insert games', () => 
            testHelperObject.seedTestGames(
                db, 
                testUsers,
                testGames,
                testFolders
            )
        )

        const protectedEndpoints = [
            {
                name: 'GET /folders',
                path: '/folders'
            },
            {
                name: 'POST /folders',
                path: '/folders'
            },
            {
                name: 'DELETE /folders by ID',
                path: '/folders/id/:folderId'
            },
            {
                name: 'GET /folders by ID',
                path: '/folders/id/:folderId'
            },
            {
                name: 'POST /games',
                path: '/games'
            },
            {
                name: 'GET /games by userId',
                path: '/games'
            },
            {
                name: 'DELETE /games by game ID',
                path: '/games/id/:gameId'
            },
            {
                name: 'PATCH /games by game ID',
                path: '/games/id/:gameId'
            }
        ]

        protectedEndpoints.forEach(endpoint => {
            describe(endpoint.name, () => {
                it (`responds with 401 when no bearer token/incorrect authorization`, () => {
                    return supertest(app)
                        .get(endpoint.path)
                        .expect(401, { error: `Unauthorized request` })
                })

                it(`responds with 401 when JWT secret supplied is invalid`, () => {
                    const validUser = testUsers[0];
                    const invalidSecret = 'incorrect secret';
                    return supertest(app)
                        .get(endpoint.path)
                        .set('Authorization', testHelperObject.makeAuthenticationHeader(validUser, invalidSecret))
                        .expect(401, { error: `Unauthorized request` })
                })

                it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                    const invalidUser = { user_name: 'invalid-user-name', id: 1 }
                    return supertest(app)
                        .get(endpoint.path)
                        .set('Authorization', makeAuthenticationHeader(invalidUser))
                        .expect(401, { error: `Unauthorized request` })
                })
            })           
        })

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
                    const expectedGame = testHelperObject.makeExpectedGame(
                        testGames[0]
                    )

                    return supertest(app)
                        .get(`/games`)
                        .set('Authorization', testHelperObject.makeAuthenticationHeader(testUsers[1]))
                        .set('user_id', 1)
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
    })
})