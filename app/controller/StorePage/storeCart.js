let db = require('../../../config/database');
let Cart = require('./Cart');

let arrayOfTransaksiSession = new Array();
let HowMuchFunctionCount = 0;


module.exports = {
    getCart : async (req, res, next) => {
        // Cart.checkJumlah(req);
        let getCartItem;
        let string = "SELECT la_items.*, (SELECT la_imagesOfItems.gambar FROM la_imagesOfItems WHERE la_items.id_barang = la_imagesOfItems.id_barang ORDER BY la_imagesOfItems.id_barang ASC LIMIT 1) AS imageName, (SELECT la_sizeOfItems.size FROM la_sizeOfItems WHERE la_items.id_barang = la_sizeOfItems.id_barang ORDER BY la_sizeOfItems.id_barang ASC LIMIT 1) AS size FROM la_items WHERE la_items.id_barang IN (";
        try{
            for(var i = 0; i < req.session.TransaksiSession.length; i++){
                if((i + 1) != req.session.TransaksiSession.length){
                    string += `"${req.session.TransaksiSession[i].id}", `;
                } 
                else{
                    string += `"${req.session.TransaksiSession[i].id}") `;
                }
            }
        }
        catch(err){
            string = "";
        }
        console.log(string);
        if(!req.session.userLogin){
            if(string !== ""){
                getCartItem = await db.query(string);
                console.log(getCartItem);
                console.log(req.session.TransaksiSession)
                if(!req.session.TransaksiSession){
                    req.flash('messageCart', "Belum ada barang di keranjan anda");
                    res.render('storepage/cart', {dataProduct: getCartItem, thereIsAProductinCart: false});
                }
                else{
                    res.render('storepage/cart', {dataProduct: getCartItem, thereIsAProductinCart: true, QuantityandTotal: req.session.TransaksiSession});
                }
            }
            else{
                console.log("respon kosong");
                req.flash('messageCart', "Belum ada barang di keranjan anda");
                res.render('storepage/cart', {thereIsAProductinCart: false});
            }
        }
        else{
            if(string !== ""){
                getCartItem = await db.query(string);
                if(!req.session.TransaksiSession){
                    res.render('storepage/cart', {dataProduct: getCartItem, thereIsAProductinCart: false, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama});
                }
                else{
                    req.flash('messageCart', "Belum ada barang di keranjan anda");
                    res.render('storepage/cart', {dataProduct: getCartItem, thereIsAProductinCart: true, QuantityandTotal: req.session.TransaksiSession, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama});
                }
            }
            else{
                console.log("respon kosong");
                req.flash('messageCart', "Belum ada barang di keranjan anda");
                res.render('storepage/cart', {thereIsAProductinCart: false, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama});
            }
        }
    },
    redirect : (req, res) => {
        res.redirect('/cart');
    },

    postCart : async (req, res, next) => {
        let sessionTransaksiClear;
        let sessionTransaksiObj = new Array();
        console.log("Sessionnya sebelum dihapus : " + JSON.stringify(req.session.TransaksiSession));    
        for(var i = 0; i < req.session.TransaksiSession.length; i++){
            if(req.session.TransaksiSession[i].id == req.params.id){
                sessionTransaksiClear = i;
            }
        }
        sessionTransaksiObj = req.session.TransaksiSession;
        req.session.TransaksiSession.splice(sessionTransaksiClear, 1);
        delete req.session.TransaksiSession;
        if(sessionTransaksiObj.length != 0){
            req.session.TransaksiSession = sessionTransaksiObj;
        }
        console.log("Sessionnya setelah dihapus : " + JSON.stringify(req.session.TransaksiSession));
        res.redirect('/cart');
    }
};