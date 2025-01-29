const express = require('express');
const { createUser, loginUser, checkAuth, resetPasswordRequest, resetPassword, logout } = require('../controller/Auth');
const passport = require('passport');
const { isAuth } = require('../services/common');

const router = express.Router();
//  /auth is already added in base path
router.post('/signup', createUser)
.post('/login', loginUser)
.get('/check',isAuth, checkAuth)
.get('/logout', logout)
.post('/reset-password-request', resetPasswordRequest)
.post('/reset-password', resetPassword)
exports.router = router;