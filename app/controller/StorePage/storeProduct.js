let db = require('../../../config/database');
let fs = require('fs');
let cart = require('./Cart');

let arrayOfTransaksiSession = new Array();
let HowMuchFunctionCount = 0;


module.exports = {
    redirect : async (req, res, next) => {
        res.redirect('/');
    },

    getProduct : async (req, res, next) => {
        let id = req.params.idbarang;
        // cart(req);
        let itemsQuery = await db.query(`SELECT * FROM la_items WHERE id_barang = "${id}"`);
        if(itemsQuery.length == 0){
            res.redirect('/');
        }
        else{
            let itemsDescQuery = await db.query(`SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.description , la_items.jenis, la_imagesOfItems.gambar, la_sizeOfItems.size FROM la_items LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang LEFT join la_sizeOfItems ON la_items.id_barang = la_sizeOfItems.id_barang WHERE la_items.id_barang = '${id}' and la_sizeOfItems.size = 'S' ORDER BY la_items.id_barang`);
            // let itemsDescQuery = await db.query(`SELECT la_items.id_barang, la_items.namabarang, la_items.harga,  la_items.desc , la_items.jenis, la_imagesOfItems.gambar FROM la_items LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang WHERE la_items.id_barang = '${id}' ORDER BY la_items.id_barang`);
            if(!itemsDescQuery){
                res.send('Data tidak ditemukan');
            }
            else{
                // fs.writeFile('../../assets/data/data.json', JSON.stringify(itemsDescQuery), (err, success) => {
                //     if(err){
                //         console.log(err);
                //     }
                //     else{
                //         console.log("Berhasil : " + success);
                //     }
                // });
                console.log("Panjang data : " + itemsDescQuery);
                if(itemsDescQuery.length <= 1){ // check is data much than 1, if greater than 1 when i didnt use this code array of images not same in index with on productshow
                    if(!req.session.userLogin){ // check is user login?
                        if(!req.session.TransaksiSession){ // check is user has added some product to their cart?
                            res.render('storepage/productshow', {userLogin: false, inCart: false, data: itemsDescQuery});
                        }
                        else{
                            res.render('storepage/productshow', {userLogin: false, inCart: true , data: itemsDescQuery, MuchOnCart: req.session.CountOfTransaction});
                        }
                    }
                    else{
                        if(!req.session.TransaksiSession){
                            res.render('storepage/productshow', {userLogin: true, inCart: false, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama , data: itemsDescQuery});
                        }
                        else{
                            res.render('storepage/productshow', {userLogin: true, inCart: true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama , data: itemsDescQuery, MuchOnCart: req.session.CountOfTransaction});
                        }
                    }
                }
                else{
                    if(!req.session.userLogin){
                        if(!req.session.TransaksiSession){
                            res.render('storepage/productshow', {userLogin: false, inCart: false, gambar: itemsDescQuery[1].gambar, data: itemsDescQuery});
                        }
                        else{
                            res.render('storepage/productshow', {userLogin: false, inCart: true, gambar: itemsDescQuery[1].gambar, data: itemsDescQuery, MuchOnCart: req.session.CountOfTransaction});
                        }
                    }
                    else{
                        if(!req.session.TransaksiSession){
                            res.render('storepage/productshow', {userLogin: true, inCart: false, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama, gambar: itemsDescQuery[1].gambar, data: itemsDescQuery});
                        }
                        else{
                            res.render('storepage/productshow', {userLogin: true, inCart: true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama, gambar: itemsDescQuery[1].gambar, data: itemsDescQuery, MuchOnCart: req.session.CountOfTransaction});
                        }
                    }
                }
            }
        }
    },

    postProduct : async (req, res, next) => {
        let id = req.params.idbarang;
        let jumlah = Number;
        jumlah = parseInt(req.body.jumlah);
        let isNeedtoAddtoSessionTransaksi = 0;
        console.log("Resnpon Post : " + JSON.stringify(req.body)) 
        console.log("Sizenya : " + req.body.size);
        cart.CheckJumlah(req);
        let itemsQuery = await db.query(`SELECT * FROM la_items WHERE id_barang = "${id}"`);
        if(req.body.size !== ""){
            if(!req.session.TransaksiSession){
                arrayOfTransaksiSession.push({id : itemsQuery[0].id_barang, jumlah : jumlah, nama:itemsQuery[0].namabarang, harga: itemsQuery[0].harga, size : req.body.size});
                req.session.TransaksiSession = arrayOfTransaksiSession;
                console.log(req.session.TransaksiSession);
                arrayOfTransaksiSession = [];
            }
            else{
                for(var i = 0; i < req.session.TransaksiSession.length; i++){
                    if(req.session.TransaksiSession[i].id === id && req.session.TransaksiSession[i].size === req.body.size){
                        req.session.TransaksiSession[i].jumlah += jumlah;
                        isNeedtoAddtoSessionTransaksi = 1;
                    }
                    arrayOfTransaksiSession.push(req.session.TransaksiSession[i]);
                }
                if(isNeedtoAddtoSessionTransaksi !== 1){
                    arrayOfTransaksiSession.push({id : itemsQuery[0].id_barang, jumlah : jumlah, nama:itemsQuery[0].namabarang, harga: itemsQuery[0].harga, size : req.body.size});
                    req.session.TransaksiSession = arrayOfTransaksiSession;
                }
                console.log("Isi Session Transaksinya : " + JSON.stringify(req.session.TransaksiSession));
                arrayOfTransaksiSession = [];
            }
            console.log(req.session.TransaksiSession);
            res.redirect('/product/search/' + req.params.idbarang);
        }
        else{
            req.flash('info', 'Maaf anda belum memilih ukuran');
            res.redirect('/product/search/' + req.params.idbarang);
        }
    },

    //API
    getProductSize : async (req, res, next) => {
        let itemsSize = await db.query(`SELECT 
                                        la_items.id_barang, 
                                        la_sizeOfItems.stock 
                                        FROM 
                                        la_items, 
                                        la_sizeOfItems 
                                        WHERE 
                                        la_items.id_barang = la_sizeOfItems.id_barang
                                        AND la_items.id_barang = "${req.params.idbarang}"
                                        AND la_sizeOfItems.size = "${req.params.size}"`
                        )
        res.json(itemsSize);
    }

};