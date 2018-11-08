'use strict'

const express = require('express');
const router = express.Router();

let controller = require('../../app/controller/StorePage');

/* GET home page. */
router.get('/', controller.indexStore.get);

router.get('/verifikasi/:idtransaksi', controller.storePaymentVerification.getVerification);
router.post('/verifikasi/:idtransaksi', controller.storePaymentVerification.postVerification);


router.get('/login', controller.loginStore.getLogin);
router.post('/login', controller.loginStore.postLogin);
router.post('/login/cart', controller.loginStore.cartLogin);
router.get('/logout/:username', controller.loginStore.getLogout);


router.get('/show/tshirt', controller.showAllProduct.getTshirt);
router.get('/show/jeans', controller.showAllProduct.getJeans);
router.get('/show/jacket', controller.showAllProduct.getJacket);

router.get('/cart', controller.storeCart.getCart);
router.get('/cart/:id', controller.storeCart.redirect);
router.post('/cart/:id', controller.storeCart.postCart);

router.get('/checkout', controller.storeCheckOut.getCheckOut);
router.post('/checkout', controller.storeCheckOut.postCheckOut);
router.post('/checkout/order', controller.storeCheckOut.postCheckOutOrder);
router.get('/checkout/receipt', controller.storeCheckOut.getReceipt);

router.get('/product/search/', controller.storeProduct.redirect);
router.get('/product/search/:idbarang', controller.storeProduct.getProduct);
router.post('/product/search/:idbarang', controller.storeProduct.postProduct);
router.get('/product/:idbarang/:size', controller.storeProduct.getProductSize);

router.get('/account/:username', controller.storeProfile.getUser);
router.post('/account/:username', controller.storeProfile.postUser);
router.post('/upload', controller.storeProfile.postUser);

router.get('/register/:id', controller.storeRegister.getRegister);
router.post('/register', controller.storeRegister.postRegister);

module.exports = router;
