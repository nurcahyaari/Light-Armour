let db = require('../../../config/database');
let Chance = require('chance');
let Cart = require('./Cart');



/* GET home page. */


module.exports = {
    get : async (req, res, next) => {
        chance = new Chance();
        console.log("String acak " + chance.string({length: 24, pool: 'abcdefghijklmnopestuvwxyz1234567890'}));
        console.log(req.session.userLogin);
        Cart.CheckJumlah(req);
        console.log("Index, transaksi session " + JSON.stringify(req.session.TransaksiSession));
        console.log("Index, panjang transaksi " + req.session.CountOfTransaction);
        let itemsIndex = await db.query('SELECT la_items.id_barang, la_items.namabarang, la_items.harga,   la_items.jenis, la_imagesOfItems.gambar FROM `la_items` LEFT JOIN la_imagesOfItems ON la_items.id_barang = la_imagesOfItems.id_barang GROUP by la_items.id_barang');
        if(!itemsIndex){
            res.send('Gagal mengambil data');
        }
        else{
            if(!req.session.userLogin){
                if(!req.session.TransaksiSession){
                    res.render('storepage/index', {title: "Index", row: itemsIndex});
                }
                else{
                    res.render('storepage/index', {title: "Index", row: itemsIndex, inCart: true, MuchOnCart: req.session.CountOfTransaction});
                }
            }
            else{
                if(!req.session.TransaksiSession){
                    res.render('storepage/index', {title: "Index", row: itemsIndex, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama});
                }
                else{
                    res.render('storepage/index', {title: "Index", row: itemsIndex, userLogin : true, inCart: true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama, MuchOnCart: req.session.CountOfTransaction});
                }
            }
        }
    }
};
