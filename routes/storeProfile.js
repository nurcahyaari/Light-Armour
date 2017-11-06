let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let connect = require('../Model/connect');
let url = require('url');
let fs = require('fs');
let path = require('path');
let formidable = require('formidable')
let secret = 'jdmforlife';

/* GET users listing. */
//router to see user account
router.get('/account/:username', function(req, res, next){
  if(!req.session.userLogin){
    res.redirect('/login');
  }
  else{
    if(req.params.username === req.session.userLogin.username){
      connect.query('SELECT * FROM `la_user` WHERE `username` = "' + req.params.username + '"', function(err, row){
        res.render('storepage/profile', {title: "Index", profile: row, userLogin : true, login_username: req.session.userLogin.username, login_nama: req.session.userLogin.nama, username: row[0].username})
      });
    }
    else{
      res.redirect('/account/'+req.session.userLogin.username);
    }
  }
})



router.post('/upload', (req, res, next) => {
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
    form.uploadDir = path.join(__dirname, '../public/uploads/');
  
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
    
    form.on('file', function(field, file) {
      fs.rename(file.path, path.join(form.uploadDir, file.name));
      res.send(file.name);
      connect.query(`SELECT * FROM la_user WHERE username = "${req.session.userLogin.username}"`, (err, data) => {
        if(data != 0){
          connect.query(`SELECT * FROM la_user WHERE username != "${req.session.userLogin.username}"`, (err, data1) => {
            for(var i = 0; i < data1.length; i++){
              console.log(data);
              console.log("\n Data dari data1 :")
              console.log(data1[i]);
              if(data[0].picture_profile == data1[i].picture_profile){
                isSameName = false;
                isSameNumber = i;
                break;
              }
              else{
                isSameName = true;
              }
            }
            if(isSameName){
              if(data[0].picture_profile !== ""){
                fs.unlink('./public/uploads/' + data[0].picture_profile)
              }
            }
          })
          
        }

        connect.query(`UPDATE la_user SET picture_profile="${file.name}" WHERE username = "${req.session.userLogin.username}"`)
      })
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
    
  }
})
module.exports = router;
