const express = require('express');
const { addToCart, fetchCartByUser, deleteFromCart, updateCart } = require('../controller/Cart');
const { isAuth } = require('../services/common');

const router = express.Router();
//  /products is already added in base path
router.post('/', isAuth,addToCart)
      .get('/',isAuth, fetchCartByUser)
      .delete('/:id',isAuth,deleteFromCart)
      .patch('/:id', isAuth,updateCart)


exports.router = router;