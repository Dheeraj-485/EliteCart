const express = require('express');
const { fetchUserById, updateUser } = require('../controller/User');
const { isAuth } = require('../services/common');

const router = express.Router();
//  /users is already added in base path
router.get('/own',isAuth, fetchUserById)
      .patch('/:id', isAuth,updateUser)

exports.router = router;