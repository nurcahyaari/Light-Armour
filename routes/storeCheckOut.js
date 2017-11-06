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
let chance = require('chance').Chance();


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'officiallightarmour@gmail.com',
      pass: 'official2017'
    }
});

const mail = new email({
    message: {
        from: 'officiallightarmour@gmail.com'
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: {
        jsonTransport: true
    }
})
router.get('/checkout', (req, res, next) => {
    if(req.session.TransaksiSession){
        if(!req.session.userLogin){
            res.render('storepage/checkOut', {userLogin : false});
        }
        else{
            res.render('storepage/checkOut', {userLogin : true, login_username: req.session.userLogin.username, login: req.session.userLogin, login_nama: req.session.userLogin.nama});
        }
    }
    else{
        res.redirect('/')
    }
})

router.post('/checkout', (req, res, next) => {
    let totalHarga = Number;
    totalHarga = 0;
    let MessageBelanjaan = String;
    let insertToDB = String;
    let idTransaksi = chance.string({length: 24, pool: 'abcdefghijklmnopestuvwxyz1234567890'});
    connect.query('SELECT id_transaksi FROM la_transaction', (err, data) => {
        for(var i = 0; i < data.length; i++){
             if(data[i].id_transaksi === idTransaksi){
                 idTransaksi = chance.string({length: 24, pool: 'abcdefghijklmnopestuvwxyz1234567890'});
             }
        }
        if(!req.session.userLogin){
            for(var i = 0; i < req.session.TransaksiSession.length; i++){
                totalHarga += req.session.TransaksiSession[i].jumlah * req.session.TransaksiSession[i].harga;
            }
            insertToDB = "INSERT INTO la_itemsOfTransaction(id_transaksi, id_barang, jumlah) VALUES "
            for(var i = 0; i < req.session.TransaksiSession.length; i++){
                if((i+1) != req.session.TransaksiSession.length){
                    insertToDB += "('" + idTransaksi + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + "), "
                }
                else{
                    insertToDB += "('" + idTransaksi + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + ")"
                }
            }
            connect.query(`INSERT INTO la_transaction(id_pembeli, totalHarga, status, id_transaksi) VALUES ('${req.body.email}',${totalHarga},0,"${idTransaksi}")`)
            connect.query(insertToDB);
            console.log("Total belanjaan : " + totalHarga);
        }
        if(req.session.TransaksiSession){
            MessageBelanjaan = `<h1>Hallo   ${req.body.nama}</h1>
                                <p>Kamu sudah membeli </p>`;
            for(var i = 0; i < req.session.TransaksiSession.length; i++){
                MessageBelanjaan += `<p>${req.session.TransaksiSession[i].nama} dengan jumlah ${req.session.TransaksiSession[i].jumlah}</p>`
            }
            MessageBelanjaan += `<p>Total belanjaanmu ${totalHarga}</p>
                                 <p> Silahkan buka link ini untuk melakukan verifikasi pembayaran : 
                                 http://localhost:3000/verifikasi/${idTransaksi}</p>`
            mail.send({
                template: 'checkout',
                message: {
                    to: '"'+ req.body.email +'"'
                },
                locals: {
                    name: 'Ari'
                }
            }).then(console.log).catch(console.error);
        
            var mailOptions = {
                from: 'officiallightarmour@gmail.com',
                to: `${req.body.email}`,
                subject: 'Terimakasih Sudah Berbelanja',
                html: MessageBelanjaan
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                }else {
                  console.log('Email sent: ' + info.response);
                  res.redirect('/');
                }
            });
            req.session.TransaksiSession = null;
            
        }else{
    
        }
    })
})

module.exports = router;