let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let connect = require('../Model/connect');
let url = require('url');
let fs = require('fs');
let secret = 'jdmforlife';

//router for register and login
router.get('/register', function(req, res, next){
    var date = new Date();
    console.log(Date.now());
    res.render('storepage/register');
  });
  
  router.post('/register', function(req, res, next){
    var date = new Date();
    var password = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
    console.log(date);
    connect.query('INSERT INTO `la_user`(`nama`, `password`,  `tgl_daftar`, `email`, `username`) VALUES ("' + req.body.nama + '", "' + password + '",  "' + date.toLocaleString() + '" , "' + req.body.email + '", "' + req.body.username + '")', function(err, data){
      if(err){
        res.send('Gagal menyimpan data');
      }
      else{
        req.flash('info', 'Akun anda sudah berhasil didaftarkan silahkan login');
        res.redirect('/login')
      }
    })
  });


module.exports = router;