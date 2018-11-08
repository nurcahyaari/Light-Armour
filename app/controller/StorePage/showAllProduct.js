
let db = require('../../../config/database');

module.exports = {
    getTshirt : async (req, res, next) => {
        let tshirtData;
        if(!req.session.userLogin){
            tshirtData = await db.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.jenis = "baju" ORDER BY la_items.id_barang');
            res.render('storepage/allProduct', {data: tshirtData, length : tshirtData.length});
            console.log(tshirtData);
        }
        else{
            tshirtData = await db.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.jenis = "baju" ORDER BY la_items.id_barang');
            res.render('storepage/allProduct', {data: tshirtData, length : tshirtData.length, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama});
        }
    },
    getJeans : async (req, res, next) => {
        let jeansData;
        if(!req.session.userLogin){
            jeansData = await db.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.jenis = "celana" ORDER BY la_items.id_barang');
            res.render('storepage/allProduct', {data: jeansData, length : jeansData.length});
        }
        else{
            jeansData = await db.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.jenis = "celana" ORDER BY la_items.id_barang');
            res.render('storepage/allProduct', {data: jeansData, length : jeansData.length, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama});
        }
    },
    getJacket : async (req, res, next) => {
        let jacketData;
        if(!req.session.userLogin){
            jacketData = await db.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.jenis = "jacket" ORDER BY la_items.id_barang');
            res.render('storepage/allProduct', {data: jacketData, length : jacketData.length});
        }
        else{
            jacketData = await db.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.jenis = "jacket" ORDER BY la_items.id_barang');
            res.render('storepage/allProduct', {data: jacketData, length : jacketData.length, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama});
        }
    }
};