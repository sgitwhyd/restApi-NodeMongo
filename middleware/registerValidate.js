const { check, validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(404).json({
            status: false,
            msg: errors.array()[0].msg
        })
    }
    next()
}

exports.validateDaftar = [
    check('name', 'Name cannot be empty').notEmpty(),
    check('username', 'Username cannot be empty').notEmpty(),
    check('email', 'Email cannot be empty').notEmpty().matches(/.+\@.+\..+/).withMessage('Invalid Email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain numbers')
]

exports.validateLogin = [
    check('email', 'Email cannot be empty').notEmpty().matches(/.+\@.+\..+/).withMessage('Invalid Email'),
    check('password', 'Password cannot be empty').notEmpty()
]