let db = require('../../../config/database');
let fs = require('fs');
let path = require('path');
let formidable = require('formidable');

let nodemailer = require('nodemailer');
// let email = require('email-templates');
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
    getVerification : async (req, res, next) => {
        let verif = await db.query(`SELECT 
                                    la_transaction.id_pembeli, 
                                    la_transaction.id_transaksi, 
                                    la_transaction.totalHarga, 
                                    la_itemsOfTransaction.id_barang, 
                                    la_itemsOfTransaction.jumlah,
                                    la_itemsOfTransaction.size, 
                                    la_items.namabarang, 
                                    la_imagesOfItems.gambar 
                                    FROM 
                                    la_transaction, 
                                    la_items, 
                                    la_itemsOfTransaction, 
                                    la_imagesOfItems
                                    WHERE 
                                    la_transaction.id_transaksi = la_itemsOfTransaction.id_transaksi 
                                    AND la_itemsOfTransaction.id_barang = la_items.id_barang 
                                    AND la_imagesOfItems.id_barang = la_itemsOfTransaction.id_barang
                                    AND la_transaction.id_transaksi = "${req.params.idtransaksi}"
                                    GROUP BY la_itemsOfTransaction.size`
        );
        if(verif.length >= 1){
            res.render('storepage/verification', {yourProduct: verif})
        }
        else{
            res.send("Maaf anda belum melakukan transaksi apapun");
        }
    },
    postVerification : async (req, res, next) => {
        var form = new formidable.IncomingForm();
        let fileType = String;
        
        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = true;
        // store all uploads in the /uploads directory
        form.uploadDir = path.join(__dirname, '../../assets/transfer/');
        
        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        
        form.onPart = function (part) {
            if(!part.filename || part.filename.match(/\.(jpg|jpeg|png)$/i)) {
                this.handlePart(part);
            }
            else {
                res.send('File is not allowed');
            }
        }

        form.on('field', async function(name, field){
            MessageBelanjaan = `<h1>Terimakasih sudah melakukan verifikasi</h1>`;
            console.log(field);
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
                to: `${field}`,
                subject: 'Terimakasih Sudah Berbelanja',
                html: MessageBelanjaan
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                }else {
                console.log('Email sent: ' + info.response);
                }
            });
        })
        
        form.on('file', async function(field, file) {
            fs.rename(file.path, path.join(form.uploadDir, file.name));
            

            req.flash('info', 'Bukti Transfer Anda sudah terkirim, silahkan tunggu untuk verifikasi dari admin');
            res.redirect('/verifikasi/' + req.params.idtransaksi);

            await db.query(`UPDATE la_transaction SET transferImage="${file.name}" WHERE id_transaksi = "${req.params.idtransaksi}"`)

        });
        // log any errors that occur
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });
        
        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
            res.end('success');
        });
        
        // parse the incoming request containing the form data
        form.parse(req);
        // res.send(req.params.idtransaksi);
    }
};