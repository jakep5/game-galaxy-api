const knex = require('knex')
const app = require('../src/app')
const testHelperObject = require('./testHelperObject')
const bcrypt = require('bcryptjs')

describe('Users endpoints', function() {
    let db;

    before('make knex instance',() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
    });

    after('disconnect from db', () => db.destory());

    before('cleanup', () => testHelperObject.cleanTables(db));

    afterEach('cleanup', () => testHelperObject.cleanTables(db));

    describe(`POST /users/`, () => {
        context('Correct path', () => {
            it('responds with 201, storing bcrypted password on user creation', () => {
                const newUser = {
                    user_name: 'testuser',
                    password: '!Testpassword1'
                }
                return supertest(app)
                    .post('/users/')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.not.have.property('password')
                    })
                    .expect(res => {
                        db
                            .from('gamegalaxy_users')
                            .select('*')
                            .where({ id: 1})
                            .first()
                            .then(row => {
                                expect(row.user_name).to.eql(newUser.user_name)
                                return bcrypt.compare(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true;
                            })
                    })
            })
        })
    })
})