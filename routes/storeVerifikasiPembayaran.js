let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let connect = require('../Model/connect');
let url = require('url');
let fs = require('fs');
let nodemailer = require('nodemailer');
let secret = 'jdmforlife';
let email = require('email-templates');
let cart = require('../Model/cartModel');

router.get('/verifikasi/:idtransaksi', (req, res, next) => {
    connect.query(`SELECT la_transaksi.id_pembeli, la_transaksi.id_transaksi, la_transaksi.totalHarga, 
                    la_transaksiBarangnya.id_barang, la_items.namabarang, gambar.gambar FROM la_transaksi, la_items, la_transaksiBarangnya , gambar
                    WHERE la_transaksi.id_transaksi = la_transaksiBarangnya.id_transaksi 
                    AND la_transaksiBarangnya.id_barang = la_items.id_barang 
                    AND gambar.id_barang = la_transaksiBarangnya.id_barang
                    AND la_transaksi.id_transaksi = "${req.params.idtransaksi}"
                    GROUP BY la_transaksiBarangnya.id_barang`, (err, data) => {
        if(data.length >= 1){
            res.render('storepage/verification', {yourProduct: data})
            // res.send("Data belanjaan anda : " + JSON.stringify(data))
        }
        else{
            res.send("Maaf anda belum melakukan transaksi apapun");
        }
    })
    
})

module.exports = router;