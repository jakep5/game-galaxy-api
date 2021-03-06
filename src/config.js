module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/game-galaxy',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/game-galaxy-test',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '1800s',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'
};