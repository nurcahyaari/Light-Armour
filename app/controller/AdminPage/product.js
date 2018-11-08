let fs = require('fs');
let path = require('path');
let formidable = require('formidable')

module.exports = {
    getProduct : async (req, res, next) => {
        console.log(req.query.type);
        console.log(req.query.id);
        if(req.query.type == "edit" && !req.query.size){
            let productQuery = await req.db.query(`SELECT * FROM la_items WHERE id_barang = "${req.query.id}"`);
            let productImage = await req.db.query(`SELECT * FROM la_imagesOfItems WHERE id_barang = "${req.query.id}"`);
            res.render('product', {
                user : {
                    name : "req.session.userInfo.nama",
                    username : "req.session.userInfo.username"
                },
                data : productQuery,
                images : productImage
            })
        }
        else if(req.query.type === "edit" && req.query.size){
            let productSize = await req.db.query(`SELECT * FROM la_sizeOfItems WHERE id_barang = "${req.query.id}" AND size = "${req.query.size}"`);
            res.json({
                data : productSize
            })
        } else if(req.query.type === "addProduct"){
            res.render('addProduct', {
                user : {
                    name : "req.session.userInfo.nama",
                    username : "req.session.userInfo.username"
                },
            });
        } else if(req.query.type === "getId" && req.query.use === "searchId"){
            let isHasQuery = await req.db.query(`SELECT id_barang FROM la_items WHERE id_barang = "${req.query.id}"`);
            let isHas = (isHasQuery.length > 0) ? true : false;
            console.log(isHas);
            if(isHas){
                res.json({
                    HaveThisId : true
                })
            } else {
                res.json({
                    HaveThisId : false
                })
            }
        }
    },

    postProduct : async (req, res, next) => {
        if(req.query.type === "edit"){
            console.log(req.body);
            console.log(req.body.desc);
            await req.db.query(`UPDATE la_items SET namabarang="${req.body.namabarang}",harga=${parseInt(req.body.harga)},description= "${req.body.desc}" WHERE id_barang = "${req.body.id_barang}"`);
            for(let i = 0; i < req.body.size.length; i++){
                await req.db.query(`UPDATE la_sizeOfItems SET size="${req.body.size[i].size}",stock=${req.body.size[i].val} WHERE id = ${req.body.size[i].id}`);
            }
            res.json({
                info : "success"
            })
        } else if(req.query.type === "upload"){
            console.log("Upload");
            // create an incoming form object
            var form = new formidable.IncomingForm();
            let fileType = String;
            
            // specify that we want to allow the user to upload multiple files in a single request
            form.multiples = true;
            // store all uploads in the /uploads directory
            form.uploadDir = path.join(__dirname, '../../../assets/img');
            
            // every time a file has been uploaded successfully,
            // rename it to it's orignal name
            
            form.onPart = function (part) {
                if(!part.filename || part.filename.match(/\.(jpg|jpeg|png)$/i)) {
                    this.handlePart(part);
                }
                else {
                    // res.send('File is not allowed');
                }
            }

            form.on('file', async function(field, file) {
                if(file.size !== 0){
                    fs.rename(file.path, path.join(form.uploadDir, file.name));
                    await req.db.query(`INSERT INTO la_imagesOfItems VALUES ("","${req.query.id}","${file.name}")`);
                }
            });

            
            
            // log any errors that occur
            form.on('error', function(err) {
                console.log('An error has occured: \n' + err);
            });
            
            // once all the files have been uploaded, send a response to the client
            form.on('end', function() {
                // res.end('success');
                res.json({
                    info : "success"
                })
            });
            
            // parse the incoming request containing the form data
            form.parse(req);
            
        } else if(req.query.type === "addProduct"){
            console.log("add Product");
            let addToItems = await req.db.query(`INSERT INTO la_items(id_barang, namabarang, harga, jenis, description) VALUES ("${req.body.id_barang}","${req.body.namabarang}",${req.body.harga},"${req.body.jenis}","${req.body.desc}")`);
            let addToSizeString = `INSERT INTO la_sizeOfItems (id_barang, size, stock) VALUES `;
            for(let i = 0; i < req.body.size.length; i++){
                if(i + 1 === req.body.size.length){
                    addToSizeString += `("${req.body.id_barang}","${req.body.size[i].size}",${req.body.size[i].val})`
                } else {
                    addToSizeString += `("${req.body.id_barang}","${req.body.size[i].size}",${req.body.size[i].val}),`
                }
            }
            if(req.body.size.length > 0){
                let addToSize = await req.db.query(addToSizeString);
            }
            console.log(req.body);
            if(addToItems){
                res.json({info : "success"})
            }
            res.json({info : "failed"})
        }
    },

    deleteImage : async (req, res, next) => {
        console.log("Delete");
        console.log(req.body);
        let imageName = await req.db.query(`SELECT gambar FROM la_imagesOfItems WHERE id = ${req.body.id}`);
        console.log(imageName[0].gambar)
        console.log('./assets/img/' + imageName[0].gambar);
        if(fs.existsSync('./assets/img/' + imageName[0].gambar)){
            fs.unlink('./assets/img/' + imageName[0].gambar);
        }
        await req.db.query(`DELETE FROM la_imagesOfItems WHERE id = ${req.body.id}`);
        // fs.unlink('./assets/img/' + imageName[0].gambar);
        // await req.db.query(`DELETE FROM la_imagesOfItems WHERE id = ${req.body.id}`);
        res.json({
            "kirim" : "Berhasil"
        })
        
    },

    addProduct: async (req, res, next) => {

    }
}