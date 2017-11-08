let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let connect = require('../Model/connect');
let url = require('url');
let fs = require('fs');
let secret = 'jdmforlife';
let cart = require('../Model/cartModel');


router.get('/tshirt', (req, res, next) => {
    if(!req.session.userLogin){
        connect.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.jenis = "baju" ORDER BY la_items.id_barang', (err, data) => {
            res.render('storepage/allProduct', {data: data, length : data.length});
            console.log(data);
        })
    }
    else{
        connect.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.jenis = "baju" ORDER BY la_items.id_barang', (err, data) => {
            res.render('storepage/allProduct', {data: data, length : data.length, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama});
            console.log(data);
        })
    }
})

router.get('/jeans', (req, res, next) => {
    if(!req.session.userLogin){
        connect.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.jenis = "celana" ORDER BY la_items.id_barang', (err, data) => {
            res.render('storepage/allProduct', {data: data, length : data.length});
            console.log(data);
        })
    }
    else{
        connect.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.jenis = "celana" ORDER BY la_items.id_barang', (err, data) => {
            res.render('storepage/allProduct', {data: data, length : data.length, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama});
            console.log(data);
        })
    }
});

router.get('/jacket', (req, res, next) => {
    if(!req.session.userLogin){
        connect.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.jenis = "jacket" ORDER BY la_items.id_barang', (err, data) => {
            res.render('storepage/allProduct', {data: data, length : data.length});
            console.log(data);
        })
    }
    else{
        connect.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.jenis = "jacket" ORDER BY la_items.id_barang', (err, data) => {
            res.render('storepage/allProduct', {data: data, length : data.length, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama});
            console.log(data);
        })
    }
});

module.exports = router;