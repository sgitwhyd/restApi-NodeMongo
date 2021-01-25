require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    const token = req.header('auth')

    if (!token) {
        return res.status(401).json({
            status: false,
            msg: 'token not empty'
        })
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({
                status: false,
                msg: 'token expired'
            })
        }
        req.id = decodedToken.id
        next()
    })
}