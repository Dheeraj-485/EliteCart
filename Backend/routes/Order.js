const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder,fetchAllOrders } = require('../controller/Order');
const { isAuth } = require('../services/common');

const router = express.Router();
//  /orders is already added in base path
router.post('/', isAuth,createOrder)
      .get('/own/',isAuth, fetchOrdersByUser)
      .delete('/:id', isAuth,deleteOrder)
      .patch('/:id', isAuth,updateOrder)
      .get('/',isAuth,fetchAllOrders)


exports.router = router;