let db = require('../../../config/database');
let nodemailer = require('nodemailer');
// let email = require('email-templates');
let chance = require('chance').Chance();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'officiallightarmour@gmail.com',
      pass: 'official2018'
    }
});

// const mail = new email({
//     message: {
//         from: 'officiallightarmour@gmail.com'
//     },
//     // uncomment below to send emails in development/test env:
//     send: true,
//     transport: {
//         jsonTransport: true
//     }
// })
module.exports = {
    getCheckOut : async (req, res, next) => {
        if(req.session.TransaksiSession){
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
            let getCarttItem = await db.query(string);
            if(!req.session.userLogin){
                res.render('storepage/checkOut', {userLogin : false});
            }
            else{
                let userInfo = await db.query(`SELECT * FROM la_user LEFT JOIN la_userAddress ON la_user.username = la_userAddress.username WHERE la_user.username = "${req.session.userLogin.username}"`);
                console.log(getCarttItem);
                res.render('storepage/checkOut', {userData : userInfo, Items: getCarttItem, userLogin : true, login_username: req.session.userLogin.username, login: req.session.userLogin, login_nama: req.session.userLogin.nama});
            }
        }
        else{
            res.redirect('/')
        }
    },

    postCheckOut : async (req, res, next) => {
        if(req.session.userLogin){
            console.log("Isi data req body checkout : " + JSON.stringify(req.body));
            console.log("isi Transaksi Session: " + JSON.stringify(req.session.TransaksiSession));
            let totalHarga = Number;
            totalHarga = 0;
            let MessageBelanjaan = String;
            let insertToDB = String;
            let idTransaksi = chance.string({length: 24, pool: 'abcdefghijklmnopestuvwxyz1234567890'});
            let transactionQuery = await db.query('SELECT id_transaksi FROM la_transaction');
            for(var i = 0; i < transactionQuery.length; i++){
                if(transactionQuery[i].id_transaksi === idTransaksi){
                    idTransaksi = chance.string({length: 24, pool: 'abcdefghijklmnopestuvwxyz1234567890'});
                }
            }
            // if(!req.session.userLogin){
            //     for(var i = 0; i < req.session.TransaksiSession.length; i++){
            //         totalHarga += req.session.TransaksiSession[i].jumlah * req.session.TransaksiSession[i].harga;
            //     }
            //     insertToDB = "INSERT INTO la_itemsOfTransaction(id_transaksi, id_barang, jumlah, size) VALUES "
            //     for(var i = 0; i < req.session.TransaksiSession.length; i++){
            //         if((i+1) != req.session.TransaksiSession.length){
            //             insertToDB += "('" + idTransaksi + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + ",'" + req.session.TransaksiSession[i].size + "'), "
            //         }
            //         else{
            //             insertToDB += "('" + idTransaksi + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + ", '" + req.session.TransaksiSession[i].size + "')"
            //         }
            //     }
            //     await db.query(`INSERT INTO la_transaction(id_pembeli, totalHarga, status, id_transaksi) VALUES ('${req.body.email}',${totalHarga},0,"${idTransaksi}")`);
            //     await db.query(insertToDB);
            //     console.log("Total belanjaan : " + totalHarga);
            // }
            for(var i = 0; i < req.session.TransaksiSession.length; i++){
                totalHarga += req.session.TransaksiSession[i].jumlah * req.session.TransaksiSession[i].harga;
            }
    
            insertToDB = "INSERT INTO la_itemsOfTransaction(id_transaksi, id_barang, jumlah, size) VALUES "
            for(var i = 0; i < req.session.TransaksiSession.length; i++){
                if((i+1) != req.session.TransaksiSession.length){
                    insertToDB += "('" + idTransaksi + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + ",'" + req.session.TransaksiSession[i].size + "'), "
                }
                else{
                    insertToDB += "('" + idTransaksi + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + ", '" + req.session.TransaksiSession[i].size + "')"
                }
            }
            await db.query(`INSERT INTO la_transaction(id_pembeli, totalHarga, status, id_transaksi) VALUES ('${req.body.email}',${totalHarga},0,"${idTransaksi}")`);
            await db.query(insertToDB);
            console.log("Total belanjaan : " + totalHarga);
            if(req.session.TransaksiSession){
                MessageBelanjaan = `<!doctype html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>A simple, clean, and responsive HTML invoice template</title>
                    
                    <style>
                    .invoice-box {
                        max-width: 800px;
                        margin: auto;
                        padding: 30px;
                        border: 1px solid #eee;
                        box-shadow: 0 0 10px rgba(0, 0, 0, .15);
                        font-size: 16px;
                        line-height: 24px;
                        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                        color: #555;
                    }
                    
                    .invoice-box table {
                        width: 100%;
                        line-height: inherit;
                        text-align: left;
                    }
                    
                    .invoice-box table td {
                        padding: 5px;
                        vertical-align: top;
                    }
                    
                    .invoice-box table tr td:nth-child(2) {
                        text-align: right;
                    }
                    
                    .invoice-box table tr.top table td {
                        padding-bottom: 20px;
                    }
                    
                    .invoice-box table tr.top table td.title {
                        font-size: 45px;
                        line-height: 45px;
                        color: #333;
                    }
                    
                    .invoice-box table tr.information table td {
                        padding-bottom: 40px;
                    }
                    
                    .invoice-box table tr.heading td {
                        background: #eee;
                        border-bottom: 1px solid #ddd;
                        font-weight: bold;
                    }
                    
                    .invoice-box table tr.details td {
                        padding-bottom: 20px;
                    }
                    
                    .invoice-box table tr.item td{
                        border-bottom: 1px solid #eee;
                    }
                    
                    .invoice-box table tr.item.last td {
                        border-bottom: none;
                    }
                    
                    .invoice-box table tr.total td:nth-child(2) {
                        border-top: 2px solid #eee;
                        font-weight: bold;
                    }
                    
                    @media only screen and (max-width: 600px) {
                        .invoice-box table tr.top table td {
                            width: 100%;
                            display: block;
                            text-align: center;
                        }
                        
                        .invoice-box table tr.information table td {
                            width: 100%;
                            display: block;
                            text-align: center;
                        }
                    }
                    
                    /** RTL **/
                    .rtl {
                        direction: rtl;
                        font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                    }
                    
                    .rtl table {
                        text-align: right;
                    }
                    
                    .rtl table tr td:nth-child(2) {
                        text-align: left;
                    }
                    </style>
                </head>
                
                <body>
                    <div class="invoice-box">
                        <table cellpadding="0" cellspacing="0">
                            <tr class="top">
                                <td colspan="2">
                                    <table>
                                        <tr>
                                            <td class="title">
                                                <img src="https://www.sparksuite.com/images/logo.png" style="width:100%; max-width:300px;">
                                            </td>
                                            
                                            <td>
                                                Invoice #: 123<br>
                                                Created: January 1, 2015<br>
                                                Due: February 1, 2015
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr class="information">
                                <td colspan="2">
                                    <table>
                                        <tr>
                                            <td>
                                                
                                            </td>
                                            
                                            <td>
                                                ${req.body.nama}<br>
                                                ${req.body.email}<br>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            
                            
                            <tr class="heading">
                                <td>
                                    Item
                                </td>
                                <td>
                                    Price
                                </td>
                            </tr>`
                        for(var i = 0; i < req.session.TransaksiSession.length; i++){
                            MessageBelanjaan += 
                            `<tr class="item">
                                <td>
                                    ${req.session.TransaksiSession[i].nama} (${req.session.TransaksiSession[i].jumlah}) Size = (${req.session.TransaksiSession[i].size})
                                </td>
                                <td>
                                    ${req.session.TransaksiSession[i].harga}
                                </td>
                            </tr>`
                        }
                            
                        MessageBelanjaan +=   `
                            <tr class="total">
                                <td></td>
                                
                                <td>
                                   Total: Rp. ${totalHarga}
                                </td>
                            </tr>
                            <tr class="information">
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td>
                                            <h5>Silahkan lakukan transfer bank ke : </h5>
                                            <ul>
                                                <li>Bank Mandiri</li>
                                                <li>A/N (LightArmour)</li>
                                                <li>No Rek : 3534545242534</li>
                                            </ul>
                                            <h5>Kode Referensi mu adalah 454554</h5>
                                            <h5>Untuk mempercepat verifikasi silahkan. 
                                                jika sudah melakukan transfer 
                                                tetapi belum terverifikasi maka segera verifikasi di link ini : 
                                                http://localhost:3000/verifikasi/${idTransaksi}</h5>
                                        </td>
                                    </tr>
                        </table>
                    </div>
                </body>
                </html>`;
                // mail.send({
                //     // template: 'checkout',
                //     message: {
                //         to: '"'+ req.body.email +'"'
                //     },
                //     locals: {
                //         name: 'Ari'
                //     }
                // }).then(console.log).catch(console.error);
            
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
                await db.query(`DELETE FROM la_userCart WHERE username = '${req.session.userLogin.username}'`)
                req.session.TransaksiSession = null;
                res.send(JSON.stringify(req.body));
                
            }else{
                res.send(JSON.stringify(req.body));
            } 
        }
    },

    postCheckOutOrder: async (req, res, next) => {
        res.send("Berhasil");
    },

    getReceipt: async (req, res, next) => {
        res.render('storepage/receipt')
    }
};