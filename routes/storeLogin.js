let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let connect = require('../Model/connect');
let url = require('url');
let fs = require('fs');
let secret = 'jdmforlife';
let Check = require('./checkLogin');

let arrayTransaksiInCart = new Array();
router.get('/login', function(req, res, next){
    if(!req.session.userLogin){
        res.render('storepage/userLogin');
    }
    else{
        res.redirect('/account/superadmin');
    }
});

router.post('/login',function(req, res, next){
    var insertToDB = String;
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
                        for(var i = 0; i < data.length; i++){
                            arrayTransaksiInCart.push({id: data[i].id_barang, jumlah: data[i].jumlah});
                        }
                        req.session.TransaksiSession = arrayTransaksiInCart;
                        arrayTransaksiInCart = [];
                    }
                    res.redirect('/');
                })
            }
            else{ // where transaction is not null
                connect.query(`SELECT * FROM la_userCart WHERE username = '${req.session.userLogin.username}'`, (err, data) => { // check if in database was a data, if yes program will execute 
                    if(data.length !== 0){ // where user was adding data and their have data in database
                        let isNeedToPush = Boolean;
                        let inDB = Number;
                        let inSession = Number;
                        let arrayTmp = new Array();
                        let checkDataInSeNDb = Number;

                        insertToDB = "INSERT INTO la_userCart (username, id_barang, jumlah) VALUES "
                        console.log("panjang data :  " + data.length);
                        console.log("\n Data : " + JSON.stringify(req.session.TransaksiSession));
                        console.log('\n data di DB  : ' + JSON.stringify(data));
                        for(var i = 0; i < data.length; i++){
                            checkDataInSeNDb = 1;
                            for(var j = 0; j < req.session.TransaksiSession.length; j++){
                                if(req.session.TransaksiSession[j].id == data[i].id_barang){
                                    checkDataInSeNDb++;
                                    isNeedToPush = false;
                                    data[i].jumlah += req.session.TransaksiSession[j].jumlah;
                                    arrayTmp.push({id:data[i].id_barang, jumlah:data[i].jumlah})
                                    req.session.TransaksiSession.splice( req.session.TransaksiSession.indexOf(req.session.TransaksiSession[j]), 1 );
                                    console.log("Panjang db : " + data.length)
                                    console.log("Panjang session : " + req.session.TransaksiSession.length);
                                    continue;
                                }
                                else{
                                    if(checkDataInSeNDb == 1){
                                        isNeedToPush = true;
                                    }
                                    if((i+1) == data.length){
                                        arrayTmp.push({id:req.session.TransaksiSession[j].id, jumlah:req.session.TransaksiSession[j].jumlah})
                                    }
                                    // req.session.TransaksiSession.splice( req.session.TransaksiSession.indexOf(req.session.TransaksiSession[j]), 1 );
                                    continue;
                                }
                                // checkDataInSeNDb++;
                            }
                            if(isNeedToPush){
                                arrayTmp.push({id:data[i].id_barang, jumlah:data[i].jumlah});
                                isNeedToPush = false;
                            }
                        }
                        console.log('Data nya : ' + JSON.stringify(arrayTmp));
                        for(var i = 0; i < arrayTmp.length; i++){
                            if((i+1) != arrayTmp.length){
                                insertToDB += "('" + row[0].username + "','" + arrayTmp[i].id + "'," + arrayTmp[i].jumlah + "), "
                            }
                            else{
                                insertToDB += "('" + row[0].username + "','" + arrayTmp[i].id + "'," + arrayTmp[i].jumlah + ")"
                            }
                        }
                        // for(var i = 0; i < data.length; i++){
                        //     for(var j = 0; j < req.session.TransaksiSession.length; j++){
                        //         if(req.session.TransaksiSession[j].id == data[i].id_barang){
                        //             req.session.TransaksiSession[j].jumlah += data[i].jumlah;
                        //             continue;
                        //         }
                        //         else{
                        //             isYourSessionSameInDb = false;
                        //         }
                        //     }
                        // }
                        // for(var i = 0; i < req.session.TransaksiSession.length; i++){
                        //     if((i+1) != req.session.TransaksiSession.length){
                        //         insertToDB += "('" + row[0].username + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + "), "
                        //     }
                        //     else{
                        //         insertToDB += "('" + row[0].username + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + ")"
                        //     }
                        // }
                        console.log("Data where user have a data in database so i merged it : " + insertToDB + "\n");
                        connect.query(`DELETE FROM la_userCart WHERE username = "${req.session.userLogin.username}"`, (err, data) => {
                            connect.query(insertToDB, (err, data) => {
                                if(data){
                                    insertToDB = "";
                                    connect.query(`SELECT * FROM la_userCart WHERE username = "${req.session.userLogin.username}" ORDER BY id_barang`, (err, data) => {
                                        if(data.length != 0){
                                            req.session.TransaksiSession = [];
                                            console.log(data.length);
                                            for(var i = 0; i < data.length; i++){
                                                arrayTransaksiInCart.push({id: data[i].id_barang, jumlah: data[i].jumlah});
                                            }
                                            req.session.TransaksiSession = arrayTransaksiInCart;
                                            arrayTransaksiInCart = [];
                                        }
                                        res.redirect('/');
                                    })
                                }
                            });
                        })
                    }
                    else{ // if user not have data from database
                        insertToDB = "INSERT INTO la_userCart (username, id_barang, jumlah) VALUES "
                        for(var i = 0; i < req.session.TransaksiSession.length; i++){
                            if((i+1) != req.session.TransaksiSession.length){
                                insertToDB += "('" + row[0].username + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + "), "
                            }
                            else{
                                insertToDB += "('" + row[0].username + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + ")"
                            }
                        }
                        console.log(insertToDB);
                        connect.query(insertToDB, (err, data) => {
                            if(data){
                                console.log(arrayTransaksiInCart);
                                req.session.userLogin = {username:row[0].username, nama: row[0].nama}
                                console.log(req.session.userLogin);
                                req.session.TransaksiSession = [];
                                connect.query(`SELECT * FROM la_userCart WHERE username = "${req.session.userLogin.username}" ORDER BY id_barang`, (err, data) => {
                                    if(data.length !== 0){
                                        console.log(data);
                                        for(var i = 0; i < data.length; i++){
                                            arrayTransaksiInCart.push({id: data[i].id_barang, jumlah: data[i].jumlah});
                                        }
                                        console.log("Data di array Transaksi Cart : " + JSON.stringify(arrayTransaksiInCart));
                                        req.session.TransaksiSession = arrayTransaksiInCart;
                                        console.log(req.session.TransaksiSession);
                                        arrayTransaksiInCart = [];
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
                insertToDB = "INSERT INTO la_userCart (username, id_barang, jumlah) VALUES "
                for(var i = 0; i < req.session.TransaksiSession.length; i++){
                    if((i+1) != req.session.TransaksiSession.length){
                        insertToDB += "('" + req.session.userLogin.username + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + "), "
                    }
                    else{
                        insertToDB += "('" + req.session.userLogin.username + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + ")"
                    }
                }
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