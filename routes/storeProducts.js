let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let connect = require('../Model/connect');
let url = require('url');
let fs = require('fs');
let secret = 'jdmforlife';
let cart = require('../Model/cartModel');

let arrayOfTransaksiSession = new Array();
let HowMuchFunctionCount = 0;

router.get('/product/search', (req, res, next) => {
    res.redirect('/');
})
  //router for see all product
router.get('/product/search/:idbarang', (req, res, next) => {
    let id = req.params.idbarang;
    cart(req);
    connect.query(`SELECT * FROM la_items WHERE id_barang = "${id}"`, (err, result) => {
        if(result.length == 0){
            res.redirect('/');
        }
        else{
            connect.query(`SELECT la_items.id_barang, la_items.namabarang, la_items.harga, la_items.stok, la_items.desc , la_items.jenis, la_imagesOfItems.gambar FROM la_items LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.id_barang = '${id}' ORDER BY la_items.id_barang`, (err, data) => {
                if(err){
                    res.send('Data tidak ditemukan');
                }
                else{
                    fs.writeFile('./public/data/data.json', JSON.stringify(data), (err, success) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("Berhasil : " + success);
                        }
                    });
                    console.log("Panjang data : " + data);
                    if(data.length <= 1){ // check is data much than 1, if greater than 1 when i didn't use this code array of images not same in index with on productshow
                        if(!req.session.userLogin){ // check is user login?
                            if(!req.session.TransaksiSession){ // check is user has added some product to their cart?
                                res.render('storepage/productshow', {userLogin: false, inCart: false, gambar: data[0].gambar, data: data});
                            }
                            else{
                                res.render('storepage/productshow', {userLogin: false, inCart: true, gambar: data[0].gambar, data: data, MuchOnCart: req.session.CountOfTransaction});
                            }
                        }
                        else{
                            if(!req.session.TransaksiSession){
                                res.render('storepage/productshow', {userLogin: true, inCart: false, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama, gambar: data[0].gambar, data: data});
                            }
                            else{
                                res.render('storepage/productshow', {userLogin: true, inCart: true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama, gambar: data[0].gambar, data: data, MuchOnCart: req.session.CountOfTransaction});
                            }
                        }
                    }
                    else{
                        if(!req.session.userLogin){
                            if(!req.session.TransaksiSession){
                                res.render('storepage/productshow', {userLogin: false, inCart: false, gambar: data[1].gambar, data: data});
                            }
                            else{
                                res.render('storepage/productshow', {userLogin: false, inCart: true, gambar: data[1].gambar, data: data, MuchOnCart: req.session.CountOfTransaction});
                            }
                        }
                        else{
                            if(!req.session.TransaksiSession){
                                res.render('storepage/productshow', {userLogin: true, inCart: false, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama, gambar: data[1].gambar, data: data});
                            }
                            else{
                                res.render('storepage/productshow', {userLogin: true, inCart: true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama, gambar: data[1].gambar, data: data, MuchOnCart: req.session.CountOfTransaction});
                            }
                        }
                    }
                }
            })
        }
    });
    
});

router.post('/product/search/:idbarang', function(req, res, next){
    let id = req.params.idbarang;
    let jumlah = Number;
    jumlah = parseInt(req.body.jumlah);
    let isNeedtoAddtoSessionTransaksi = 0;
    console.log("Resnpon Post : " + JSON.stringify(req.body)) 
    cart(req);
    connect.query(`SELECT * FROM la_items WHERE id_barang = "${id}"`, (err, result) => {
        if(!req.session.TransaksiSession){
            arrayOfTransaksiSession.push({id : result[0].id_barang, jumlah : jumlah, nama:result[0].namabarang, harga: result[0].harga});
            req.session.TransaksiSession = arrayOfTransaksiSession;
            console.log(req.session.TransaksiSession);
            arrayOfTransaksiSession = [];
        }
        else{
            for(var i = 0; i < req.session.TransaksiSession.length; i++){
                if(req.session.TransaksiSession[i].id === id){
                    req.session.TransaksiSession[i].jumlah += jumlah;
                    isNeedtoAddtoSessionTransaksi = 1;
                }
                arrayOfTransaksiSession.push(req.session.TransaksiSession[i]);
            }
            if(isNeedtoAddtoSessionTransaksi !== 1){
                arrayOfTransaksiSession.push({id : result[0].id_barang, jumlah : jumlah, nama:result[0].namabarang, harga: result[0].harga});
                req.session.TransaksiSession = arrayOfTransaksiSession;
            }
            console.log("Isi Session Transaksinya : " + JSON.stringify(req.session.TransaksiSession));
            arrayOfTransaksiSession = [];
        }
        res.redirect('/product/search/' + req.params.idbarang);
    });
});

module.exports = router;