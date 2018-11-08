let crypto = require('crypto');
let db = require('../../../config/database');
let secret = 'jdmforlife';

let random = require('./Random');

//Control Data
let Cart = require('./Cart');

var insertToDB = String;

module.exports = {
    getLogin : async (req, res, next) => {
        req.session.routeToRegister = {id : random.Rand()};
        if(!req.session.userLogin){
            res.render('storepage/userLogin', {secret : req.session.routeToRegister.id});
        }
        else{
            res.redirect('/account/' + req.session.userLogin.username);
        }
    },
    postLogin : async (req, res, next) => {
        var isMinus = true;
        let userCart;
        var password = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
        // row = userInfo
        let userInfo = await db.query('SELECT * FROM `la_user` WHERE `username`= "' + req.body.username + '" AND `password` = "' + password + '"');
        if(userInfo.length == 0){
            req.flash('info', 'Username atau Password yang anda inputkan salah, coba kembali');
            res.redirect('/login')
        }
        else{
            Cart.CheckJumlah(req);
            req.session.userLogin = {username:userInfo[0].username, nama: userInfo[0].nama}
            console.log(`banyak barang di keranjang : ${req.session.CountOfTransaction}`);
            if(!req.session.TransaksiSession){ // if transaksisession is null program will access this block
                // data = userCart
                userCart = await db.query(`SELECT la_userCart.username, la_userCart.id_barang, la_userCart.jumlah, la_userCart.size, la_items.namabarang, la_items.harga FROM la_userCart, la_items WHERE la_userCart.username = "${req.session.userLogin.username}" AND la_items.id_barang = la_userCart.id_barang ORDER BY la_userCart.id_barang`);
                if(userCart.length != 0){
                    Cart.pushToSession(req, userCart);
                }
                res.redirect('/');
            }
            else{ // where transaction is not null
                //data = userCart
                userCart = await db.query(`SELECT la_userCart.username, la_userCart.id_barang, la_userCart.jumlah, la_userCart.size, la_items.namabarang, la_items.harga FROM la_userCart, la_items WHERE la_userCart.username = "${req.session.userLogin.username}" AND la_items.id_barang = la_userCart.id_barang`);
                if(userCart.length !== 0){ // where user was adding data and their have data in database
                    let insertToDB = Cart.isNull(userCart, req, res, next, userInfo);
                    await db.query(`DELETE FROM la_userCart WHERE username = "${req.session.userLogin.username}"`);
                    let insertCartInDb = await db.query(insertToDB);
                    if(insertCartInDb){
                        insertToDB = "";
                        let userInfo = await db.query(`SELECT la_userCart.username, la_userCart.id_barang, la_userCart.jumlah, la_userCart.size, la_items.namabarang, la_items.harga FROM la_userCart, la_items WHERE la_userCart.username = "${req.session.userLogin.username}" AND la_items.id_barang = la_userCart.id_barang ORDER BY la_userCart.id_barang`);
                        if(userInfo.length != 0){
                            Cart.pushToSession(req, userInfo);
                        }
                        res.redirect('/');
                    }
                }
                else{ // if user not have data from database but user added some items to their cart
                    insertToDB = Cart.stringQuery(req);
                    console.log("Insert awal : " + insertToDB);
                    let insertCartInDb = await db.query(insertToDB);
                    if(insertCartInDb){
                        req.session.userLogin = {username:userInfo[0].username, nama: userInfo[0].nama}
                        console.log(req.session.userLogin);
                        req.session.TransaksiSession = [];
                        userInfo = await db.query(`SELECT la_userCart.username, la_userCart.id_barang, la_userCart.jumlah, la_userCart.size, la_items.namabarang, la_items.harga FROM la_userCart, la_items WHERE la_userCart.username = "${req.session.userLogin.username}" AND la_items.id_barang = la_userCart.id_barang ORDER BY la_userCart.id_barang`);
                        if(userInfo.length !== 0){
                            console.log(userInfo);
                            Cart.pushToSession(req, userInfo);
                            insertToDB = ""; 
                            res.redirect('/');
                        }
                    }
                    else{
                        res.send('Error')
                    }
                }
            }
            
        }
    },

    cartLogin : async (req, res, next) => {
        console.log(req.body);
        var isMinus = true;
        let userCart;
        var password = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
        // row = userInfo
        let userInfo = await db.query('SELECT * FROM `la_user` WHERE `username`= "' + req.body.username + '" AND `password` = "' + password + '"');
        if(userInfo.length == 0){
            req.flash('info', 'Username atau Password yang anda inputkan salah, coba kembali');
            res.send("wrong");
        }
        else{
            Cart.CheckJumlah(req);
            req.session.userLogin = {username:userInfo[0].username, nama: userInfo[0].nama}
            console.log(`banyak barang di keranjang : ${req.session.CountOfTransaction}`);
            if(!req.session.TransaksiSession){ // if transaksisession is null program will access this block
                // data = userCart
                userCart = await db.query(`SELECT la_userCart.username, la_userCart.id_barang, la_userCart.jumlah, la_userCart.size, la_items.namabarang, la_items.harga FROM la_userCart, la_items WHERE la_userCart.username = "${req.session.userLogin.username}" AND la_items.id_barang = la_userCart.id_barang ORDER BY la_userCart.id_barang`);
                if(userCart.length != 0){
                    Cart.pushToSession(req, userCart);
                }
                res.send("success");
            }
            else{ // where transaction is not null
                //data = userCart
                userCart = await db.query(`SELECT la_userCart.username, la_userCart.id_barang, la_userCart.jumlah, la_userCart.size, la_items.namabarang, la_items.harga FROM la_userCart, la_items WHERE la_userCart.username = "${req.session.userLogin.username}" AND la_items.id_barang = la_userCart.id_barang`);
                if(userCart.length !== 0){ // where user was adding data and their have data in database
                    let insertToDB = Cart.isNull(userCart, req, res, next, userInfo);
                    await db.query(`DELETE FROM la_userCart WHERE username = "${req.session.userLogin.username}"`);
                    let insertCartInDb = await db.query(insertToDB);
                    if(insertCartInDb){
                        insertToDB = "";
                        let userInfo = await db.query(`SELECT la_userCart.username, la_userCart.id_barang, la_userCart.jumlah, la_userCart.size, la_items.namabarang, la_items.harga FROM la_userCart, la_items WHERE la_userCart.username = "${req.session.userLogin.username}" AND la_items.id_barang = la_userCart.id_barang ORDER BY la_userCart.id_barang`);
                        if(userInfo.length != 0){
                            Cart.pushToSession(req, userInfo);
                        }
                        res.send("success");
                    }
                }
                else{ // if user not have data from database but user added some items to their cart
                    insertToDB = Cart.stringQuery(req);
                    console.log("Insert awal : " + insertToDB);
                    let insertCartInDb = await db.query(insertToDB);
                    if(insertCartInDb){
                        req.session.userLogin = {username:userInfo[0].username, nama: userInfo[0].nama}
                        console.log(req.session.userLogin);
                        req.session.TransaksiSession = [];
                        userInfo = await db.query(`SELECT la_userCart.username, la_userCart.id_barang, la_userCart.jumlah, la_userCart.size, la_items.namabarang, la_items.harga FROM la_userCart, la_items WHERE la_userCart.username = "${req.session.userLogin.username}" AND la_items.id_barang = la_userCart.id_barang ORDER BY la_userCart.id_barang`);
                        if(userInfo.length !== 0){
                            console.log(userInfo);
                            Cart.pushToSession(req, userInfo);
                            insertToDB = ""; 
                            res.send("success");
                        }
                    }
                    else{
                        res.send('Error')
                    }
                }
            }
            
        }
    },
    getLogout : async (req, res, next) => {
        if(req.session.userLogin.username === req.params.username){
            //deleting data in database then adding to database
            console.log("Logout : " + JSON.stringify(req.session.TransaksiSession));
            if(req.session.TransaksiSession){
                let deleteInCart = await db.query(`DELETE FROM la_userCart WHERE username = "${req.session.userLogin.username}"`);
                //adding to database if user login
                                    
                insertToDB = Cart.stringQuery(req);
                console.log("Insert in Logout " +insertToDB);
                await db.query(insertToDB);
                req.session.destroy();
                res.redirect('/');
            }
            else{
                let deleteInCart = await db.query(`DELETE FROM la_userCart WHERE username = "${req.session.userLogin.username}"`);
                req.session.destroy();
                res.redirect('/');
                
            }
        }
        else{
            res.redirect('/account/'+req.session.userLogin.username);
        }
    }
};