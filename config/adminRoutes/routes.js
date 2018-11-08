'use strict'

const express = require('express');
const router = express.Router();

let controller = require('../../app/controller/AdminPage');

/* GET home page. */
router.get('/', controller.login.index ,controller.adminIndex.getIndex);


router.get('/login', controller.login.getLogin);
router.post('/login', controller.login.postLogin);
router.get('/logout', controller.login.getLogout);


// Render Product
router.get('/api/ts', controller.login.index, controller.listProduct.tsirtsApi);
router.get('/api/jk', controller.login.index, controller.listProduct.jacketsApi);
router.get('/api/js', controller.login.index, controller.listProduct.jeansApi);

// GetProduct
router.get('/listProducts/:category', controller.listProduct.getRenderList);

router.get('/product', controller.product.getProduct);
router.post('/product/edit', controller.product.postProduct);
router.delete('/product/edit', controller.product.deleteImage);

// transactions
router.get('/transactions/:typeActions', controller.transactions.getTransactions);


module.exports = router;
