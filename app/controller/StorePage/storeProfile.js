let db = require('../../../config/database');
let fs = require('fs');
let path = require('path');
let formidable = require('formidable')

/* GET users listing. */
//router to see user account

module.exports = {
    getUser : async (req, res, next) => {
        if(!req.session.userLogin){
            res.redirect('/login');
        }
        else{
            if(req.params.username === req.session.userLogin.username){
                let userInfo = await db.query(`SELECT * FROM la_user LEFT JOIN la_userAddress ON la_user.username = la_userAddress.username WHERE la_user.username = "${req.params.username}"`);
                res.render('storepage/profile', {title: "Index", profile: userInfo, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama, username: userInfo[0].username})
            }
            else{
                res.redirect('/account/'+req.session.userLogin.username);
            }
        }
    },
    postUser : async (req, res, next) => {
        if(!req.session.userLogin){
            res.redirect('/login');
        }
        else{
            // create an incoming form object
            var form = new formidable.IncomingForm();
            let fileType = String;
            let isSameName = Boolean;
            let isSameNumber = Number;
            
            // specify that we want to allow the user to upload multiple files in a single request
            form.multiples = true;
            // store all uploads in the /uploads directory
            form.uploadDir = path.join(__dirname, '../../assets/uploads');
            
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

            form.on('file', async function(field, file) {
                if(file.size !== 0){
                    fs.rename(file.path, path.join(form.uploadDir, file.name));
                    res.send(file.name);
                    let userInfo = await db.query(`SELECT * FROM la_user WHERE username = "${req.session.userLogin.username}"`);
                    if(userInfo != 0){
                        let userInfo1 = await db.query(`SELECT * FROM la_user WHERE username != "${req.session.userLogin.username}"`);
                        for(var i = 0; i < userInfo1.length; i++){
                            console.log(userInfo);
                            console.log("\n Data dari data1 :")
                            console.log(userInfo1[i]);
                            if(userInfo[0].picture_profile == userInfo1[i].picture_profile){
                                isSameName = false;
                                isSameNumber = i;
                            break;
                            }
                            else{
                                isSameName = true;
                            }
                        }
                        if(isSameName){
                            if(userInfo[0].picture_profile !== ""){
                            fs.unlink('./assets/uploads/' + userInfo[0].picture_profile)
                            }
                        }
                        
                    }
                    await db.query(`UPDATE la_user SET picture_profile="${file.name}" WHERE username = "${req.session.userLogin.username}"`)
                }
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
            // form.parse(req);
            form.parse(req, async function(err, fields, files) {
                await db.query(`UPDATE la_userAddress SET Provinsi = "${fields.provinsi}", Kota = "${fields.kota}", Kecamatan = "${fields.kecamatan}", Desa = "${fields.desa}", Alamat_lengkap = "${fields.alamat}" WHERE username = "${req.session.userLogin.username}"`);
                await db.query(`UPDATE la_user SET nama = "${fields.nama}"`);
                
            });
        }
    }
};
