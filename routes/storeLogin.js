let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let connect = require('../Model/connect');
let url = require('url');
let fs = require('fs');
let secret = 'jdmforlife';
let loginCheck = require('./checkLogin');

//Control Data
let Cart = require('../Controller/Cart');


var insertToDB = String;
router.get('/login', function(req, res, next){
    if(!req.session.userLogin){
        res.render('storepage/userLogin');
    }
    else{
        res.redirect('/account/superadmin');
    }
});

router.post('/login',function(req, res, next){
    var isMinus = true;
    var password = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
    connect.query('SELECT * FROM `la_user` WHERE `username`= "' + req.body.username + '" AND `password` = "' + password + '"', function(err, row){
        if(row.length == 0){
            req.flash('info', 'Username atau Password yang anda inputkan salah, coba kembali');
            res.redirect('/login')
        }
        else{
            CheckJumlah(req);
            req.session.userLogin = {username:row[0].username, nama: row[0].nama}
            console.log(`banyak barang di keranjang : ${req.session.CountOfTransaction}`);
            if(!req.session.TransaksiSession){ // if transaksisession is null program will access this block
                connect.query(`SELECT * FROM la_userCart WHERE username = "${req.session.userLogin.username}" ORDER BY id_barang`, (err, data) => {
                    if(data.length != 0){
                        console.log(data.length);
                        Cart.pushToSession(req, data);
                    }
                    res.redirect('/');
                })
            }
            else{ // where transaction is not null
                connect.query(`SELECT * FROM la_userCart WHERE username = '${req.session.userLogin.username}'`, (err, data) => { // check if in database was a data, if yes program will execute 
                    if(data.length !== 0){ // where user was adding data and their have data in database
                        let insertToDB = Cart.isNull(data, req, res, next, row);
                        connect.query(`DELETE FROM la_userCart WHERE username = "${req.session.userLogin.username}"`, (err, data) => {
                            connect.query(insertToDB, (err, data) => {
                                if(data){
                                    insertToDB = "";
                                    connect.query(`SELECT * FROM la_userCart WHERE username = "${req.session.userLogin.username}" ORDER BY id_barang`, (err, data) => {
                                        if(data.length != 0){
                                            Cart.pushToSession(req, data);
                                        }
                                        res.redirect('/');
                                    })
                                }
                            });
                        })
                    }
                    else{ // if user not have data from database but user added some items to their cart
                        insertToDB = Cart.stringQuery(req);
                        console.log("Insert awal : " + insertToDB);
                        connect.query(insertToDB, (err, data) => {
                            if(data){
                                req.session.userLogin = {username:row[0].username, nama: row[0].nama}
                                console.log(req.session.userLogin);
                                req.session.TransaksiSession = [];
                                connect.query(`SELECT * FROM la_userCart WHERE username = "${req.session.userLogin.username}" ORDER BY id_barang`, (err, data) => {
                                    if(data.length !== 0){
                                        console.log(data);
                                        Cart.pushToSession(req, data);
                                        insertToDB = ""; 
                                        res.redirect('/');
                                    }
                                })
                            }
                            else{
                                res.send('Error')
                            }
                        })
                    }
                })
            }
            
        }
    })
})

router.get('/logout/:username', function(req, res, next){
    if(req.session.userLogin.username === req.params.username){
        //deleting data in database then adding to database
        if(req.session.TransaksiSession){
            connect.query(`DELETE FROM la_userCart WHERE username = "${req.session.userLogin.username}"`, (err, data) => {
                //adding to database if user login
                
                insertToDB = Cart.stringQuery(req);
                console.log("Insert in Logout " +insertToDB);
                connect.query(insertToDB);
                req.session.destroy();
                res.redirect('/');
            })
        }
        else{
            connect.query(`DELETE FROM la_userCart WHERE username = "${req.session.userLogin.username}"`, (err, data) => {
                req.session.destroy();
                res.redirect('/');
            })
            
        }
    }
    else{
        res.redirect('/account/'+req.session.userLogin.username);
    }
})

module.exports = router;