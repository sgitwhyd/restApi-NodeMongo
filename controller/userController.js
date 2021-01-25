require('dotenv').config()
const passport = require('passport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

// user models
const User = require('../models/user');
const { check } = require('express-validator')
const e = require('express')

// register handle
exports.registerHandle = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const token = await jwt.sign({ name, username, email, password }, process.env.JWT_KEY, { expiresIn: '15m' });
        const CLIENT_URL = 'http://' + req.headers.host;
        const checkEmail = await User.findOne({ email: email })
        const checkUsename = await User.findOne({ username: username })
        if (checkEmail) {
            return res.status(401).json({
                status: false,
                msg: 'Email already exist'
            })
        }
        else if (checkUsename) {
            return res.status(401).json({
                status: false,
                msg: 'Username already exist'
            })
        }
        else {
            const mailOptions = {
                from: 'Sigit Wahyudi', // sender address
                to: email, // list of receivers
                subject: "Account Verification: NodeJS Auth ✔", // Subject line
                html: `<p>Silahkan klik link dibawah ini  untuk aktivasi email anda</p><p>${CLIENT_URL}/auth/activate/${token}</p>
            <p>Link akan expired dalam waktu 15 Menit`
            }

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                requireTLS: true,
                auth: {
                    user: process.env.USER_GMAIL, // generated gmail user
                    pass: process.env.USER_PASS, // generated gmail password
                },
            });

            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    return res.status(404).json({
                        status: false,
                        msg: 'Someething went wrong. Please Register again'
                    })
                } else {
                    return res.status(200).json({
                        status: true,
                        msg: 'Activation link sent to email ID. Please activate to log in.'
                    })
                }
            })
        }

    } catch {
        return res.status(401).json({
            status: false,
            msg: 'Ops.. Something Wrong Please register again'
        })
    }

}


exports.activateHandle = (req, res) => {
    const token = req.params.token

    if (token) {
        jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
            if (err) {
                return res.status(404).json({
                    status: false,
                    msg: 'Incorret or expired link!. Please register again'
                })
            } else {
                const { name, username, email, password } = decodedToken
                User.findOne({ email: email }).then(user => {
                    if (user) {
                        return res.status(401).json({
                            status: false,
                            msg: 'Email already exist. Please Log In'
                        })
                    } else {
                        const newUser = new User({
                            name: name,
                            username: username,
                            email: email,
                            password: password
                        });

                        const salt = bcrypt.genSaltSync(10)

                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                console.log(err)
                            } else {
                                newUser.password = hash;
                                newUser.save()
                                    .then(() => {
                                        return res.status(200).json({
                                            status: true,
                                            msg: 'Account activate. Please Login'
                                        })
                                    })
                            }
                        })
                    }
                })
            }
        })
    } else {
        console.log('Account activation error')
    }
}

// login handle

exports.loginHandle = async (req, res) => {
    const { email, password } = req.body
    const checkUser = await User.findOne({ email: email })
    if (checkUser) {
        const isMatch = await bcrypt.compare(password, checkUser.password)
        if (isMatch) {
            const data = {
                id: checkUser._id
            }

            const token = await jwt.sign(data, process.env.JWT_KEY)
            return res.status(200).json({
                status: true,
                msg: "Login Successfully",
                token: token
            })
        }
        else {
            return res.status(404).json({
                status: false,
                msg: "Password incorrect"
            })
        }
    }
    else {
        return res.status(404).json({
            status: false,
            msg: "Email Not Registered"
        })
    }
}

exports.allUser = async (req, res) => {
    const user = await User.find({})
    if (user) {
        return res.status(200).json({
            status: true,
            data: user
        })
    }
}