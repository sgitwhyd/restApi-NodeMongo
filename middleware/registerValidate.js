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
    check('name', 'nama tidak boleh kosong').notEmpty(),
    check('username', 'Username tidak boleh kosong').notEmpty(),
    check('email', 'Email tidak boleh kosong').notEmpty().matches(/.+\@.+\..+/).withMessage('Masukan Email yang valid'),
    check('password').isLength({ min: 8 }).withMessage('Password harus minimal 8 karakter')
        .matches(/\d/).withMessage('Password harus mengandung angka')
]

exports.validateLogin = [
    check('email', 'Email tidak boleh kosong').notEmpty().matches(/.+\@.+\..+/).withMessage('Masukan Email yang valid'),
    check('password', 'password tidak boleh kosong').notEmpty()
]