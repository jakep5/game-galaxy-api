const AuthService = require('../auth/auth-service')

function requireAuthentication(req, res, next) {
    const authToken = req.get('Authorization') || ''

    let bearerToken

    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'Unauthorized request '})
    } else {
        bearerToken = authToken.slice(7, authToken.length)
    }

    try {
        const payload = AuthService.verifyJWT(bearerToken)

        AuthService.getUserWithUserName(
            req.app.get('db'),
            payload.sub
        )
            .then(user => {
                if(!user)
                    return res.status(401).json({ error: 'Unauthorized request' })
                
                req.user = user;
                next();
            })
            .catch(error => {
                next(error)
            })
    } catch(error) {
        res.status(401).json({ error: 'Unauthorized request' })
    }
}

module.exports = {requireAuthentication}