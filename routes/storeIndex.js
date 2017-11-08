let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let connect = require('../Model/connect');
let url = require('url');
let fs = require('fs');
let secret = 'jdmforlife';
let Chance = require('chance');



/* GET home page. */
router.get('/', function(req, res, next) {
  chance = new Chance();
  console.log("String acak " + chance.string({length: 24, pool: 'abcdefghijklmnopestuvwxyz1234567890'}));
  console.log(req.session.userLogin);
  CheckJumlah(req);
  console.log("Index, transaksi session " + JSON.stringify(req.session.TransaksiSession));
  console.log("Index, panjang transaksi " + req.session.CountOfTransaction);
    connect.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,   la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang GROUP by la_items.id_barang', function(err, row, field){
      if(err){
        res.send('Gagal mengambil data');
      }
      else{
        if(!req.session.userLogin){
          if(!req.session.TransaksiSession){
            res.render('storepage/index', {title: "Index", row: row});
          }
          else{
            res.render('storepage/index', {title: "Index", row: row, inCart: true, MuchOnCart: req.session.CountOfTransaction});
          }
        }
        else{
          if(!req.session.TransaksiSession){
            res.render('storepage/index', {title: "Index", row: row, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama});
          }
          else{
            res.render('storepage/index', {title: "Index", row: row, userLogin : true, inCart: true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama, MuchOnCart: req.session.CountOfTransaction});
          }
        }
      }
    })
});


module.exports = router;
