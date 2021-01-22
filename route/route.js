const express = require('express').Router()
const route = express
const { registerHandle, activateHandle, loginHandle, allUser } = require('../controller/userController')

// validate middleware
const { validateDaftar, validate, validateLogin } = require('../middleware/registerValidate')
const chekAuth = require('../middleware/checkAuth')

route.get('/', (req, res) => {
    res.status(200).json({
        msg: 'berhasil'
    })
})

// regiter route
route.post('/register', validateDaftar, validate, registerHandle)
// activate route
route.get('/auth/activate/:token', activateHandle)
// login route
route.post('/auth/login', validateLogin, validate, loginHandle)
route.get('/auth/dashboard', chekAuth, allUser)

module.exports = route