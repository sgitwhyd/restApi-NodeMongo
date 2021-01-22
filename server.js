require('dotenv').config()
const express = require('express')
const app = express()
const expressSession = require('express-session')
const passport = require('passport')
const mongo = require('mongoose')
const route = require('./route/route')
const bodyParser = require('body-parser')
const cors = require('cors')


// body-parse config
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// express session config
app.use(
    expressSession({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())


// route
app.use('/', route)


// mongo connection
mongo.connect(process.env.DB, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('succesfully connect to monggoDB')
}).catch((e) => {
    console.log(e)
})


// set server
app.listen(process.env.PORT, () => {
    console.log(`server running on PORT ${process.env.PORT}`)
})