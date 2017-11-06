var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var connect = require('../Model/connect');


var secret = 'jdmforlife';

router.get(function(req, res, next){
    router.redirect('/admin');
})

router.get('/', function(req, res, next){
    if(!req.session.adminLogin){
        res.render('admin/adminLogin');
    }
    else{
        res.redirect('/admin/home');
    }
});

router.post('/', function(req, res, next){
    var password = crypto.createHmac('sha256', secret).update(req.body.psw).digest('hex');
    var login = new Array();
    connect.query('SELECT * FROM `la_admin` WHERE `username` = "' + req.body.uname + '" AND `password` = "' + password + '"', function(err, row){
        if(row){
            if(row.length === 1){
                req.session.adminLogin = {nama: row[0].nama, username: row[0].username}
                res.redirect('/admin/home');
            }
            else{
                res.redirect('/admin/');
            }
            // for(var i = 0; i < row.length; i++){
            //     if(row[i].username == req.body.uname && row[i].password == password){
            //         req.session.adminLogin = {nama: row[i].nama, username: row[i].username}
            //         res.redirect('/admin/home');
            //     }
            //     else{
            //         res.redirect('/admin/');
            //     }
            // }
        }
        else{
            res.send('Database Error');
        }
    })
})

router.get('/home', function(req, res, next){
    if(!req.session.adminLogin){
        res.redirect('/admin');
    }
    else{
        res.render('admin/adminHome', {admin_name: req.session.adminLogin.nama});
    }
});

router.get('/adddata', function(req, res, next){
    if(!req.session.adminLogin){
        res.redirect('/admin');
    }
    else{
        res.render('admin/adminAdddata');
    }
});

router.post('/adddata', function(req, res, next){
    if(!req.session.adminLogin){
        res.redirect('/admin');
    }
    else{
        connect.query('INSERT INTO `la_barang`(`namabarang`, `harga`, `stok`, `jenis`) VALUES ("' + req.body.namabarang + '",' + req.body.hargabarang + ', ' + req.body.stokbarang + ',"' + req.body.jenis + '")', function(err, data){
            if(data){
                res.redirect('/admin/table');
            }
            else{
                res.send('Gagal');
            }
        })
    }
});

router.get('/table', function(req, res, next){
    if(!req.session.adminLogin){
        res.redirect('/admin');
    }
    else{
        connect.query('SELECT * FROM `la_barang`', function(err, row, field){
            if(err){
                res.render('admin/adminTable', {getData: false, message_box: "Gagal mengambil data dari database"});
            }
            else{
                res.render('admin/adminTable', {getData: true, row: row});
            }
        })
        
    }
});

router.get('/editdata/:id_barang', function(req, res, next){
    if(!req.session.adminLogin){
        res.redirect('/admin')
    }
    else{
        connect.query('SELECT * FROM `la_barang` WHERE `id_barang` = ' + req.params.id_barang, function(err, row){
            if(row){
                res.render('admin/adminEditDataBarang',{row: row})
            }
        })
    }
})

router.post('/editdata/:id_barang', function(req, res, next){
    if(!req.session.adminLogin){
        res.redirect('/admin');
    }
    else{
        connect.query('UPDATE `la_barang` SET `namabarang`="' + req.body.namabarang + '",`harga`=' + req.body.hargabarang + ',`stok`=' + req.body.stokbarang + ',`jenis`="'+ req.body.jenis + '" WHERE `id_barang`=' + req.params.id_barang, function(err, data){
            if(err){
                res.send('Gagal mengudate data');
            }
            else{
                res.redirect('/admin/table');
            }
        })
    }
})

router.get('/users', function(req, res, next){
    if(!req.session.adminLogin){
        res.redirect('/admin');
    }
    else{
        connect.query('SELECT * FROM `la_user`', function(err, row, field){
            if(err){
                res.render('admin/adminUserList', {getData: false, message_box: "Gagal Melihat data user"});
            }
            else{
                console.log(row);
                res.render('admin/adminUserList', {getData: true, row: row});
            }
        })
        
    }
});

router.get('/transaksi', function(req, res, next){

})

//Router to log out admin account
router.get('/logout', function(req, res, next){
    req.session.destroy();
    res.redirect('/admin');
});

module.exports = router;