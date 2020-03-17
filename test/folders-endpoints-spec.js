const knex = require('knex')
const app = require('../src/app')
const testHelperObject = require('./testHelperObject')

describe('folders endpoints', function() {
    let db;

    const testFolders = testHelperObject.makeFoldersArray();
    const testUsers = testHelperObject.makeUsersArray();

    before('make knex instance for test database', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('cleanup tables', () => testHelperObject.cleanTables(db))

    afterEach('cleanup tables', () => testHelperObject.cleanTables(db));

    describe(`GET /folders corresponding to a user`, () => {
        context(`Given there are folders in the database`, () => {

            beforeEach('insert users and folders', () => {
                testHelperObject.seedTestFoldersAndUsers(
                    db,
                    testUsers,
                    testFolders
                )
            })

            it('Responds with folders corresponding to user', () => {
                const expectedFolder = testHelperObject.makeExpectedFolder(
                    testFolders[0]
                )

                return supertest(app)
                    .get(`/folders`)
                    .set('Authorization', testHelperObject.makeAuthenticationHeader(testUsers[0]))
                    .set('user_id', 1)
                    .expect(200, expectedFolder)
            })

            it('Responds with specific folder when given folder id', () => {
                const expectedFolder = testHelperObject.makeExpectedFolder(
                    testFolders[0]
                )

                return supertest(app)
                    .get('/folders/id/1')
                    .set('Authorization', testHelperObject.makeAuthenticationHeader(testUsers[0]))
                    .expect(200, expectedFolder)
            })
        })
    })

    describe(`POST /folder`, () => {
        beforeEach('insert test users', () => {
            testHelperObject.seedTestUsers(
                db,
                testUsers
            )
        })

        it('Creates a new folder entry, responding with 201', function() {
            const newFolder = {
                name: "test 3",
                user_id: 1
            }

            return supertest(app)
                .post('/folders/')
                .set('Authorization', testHelperObject.makeAuthenticationHeader(testUsers[0]))
                .set('user_id', 1)
                .send(newFolder)
                .expect(201)
        })

        it('Responds with 400 when a field is missing', function() {
            const newFolder = {
                user_id: 1
            }

            return supertest(app)
                .post('/folders/')
                .set('Authorization', testHelperObject.makeAuthenticationHeader(testUsers[0]))
                .set('user_id', 1)
                .send(newFolder)
                .expect(400)
        })
    })
})