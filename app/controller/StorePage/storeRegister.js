let crypto = require('crypto');
let db = require('../../../config/database');

let secret = 'jdmforlife';


//router for register and login




module.exports = {
    getRegister : async (req, res, next) => {
        if(req.session.routeToRegister !== undefined){
            console.log("Sebelum "+req.session.routeToRegister.id)
            if(req.params.id == req.session.routeToRegister.id){
                let userInfo = await db.query('SELECT la_user.email, la_user.username FROM la_user');
                res.json(userInfo);
            }
            else{
                res.end()
            }
        }
        else{
            res.redirect('/login')
        }
    },

    postRegister : async (req, res, next) => {
        var date = new Date();
        var password = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
        console.log(date);
        let newUser = await db.query('INSERT INTO `la_user`(`nama`, `password`,  `tgl_daftar`, `email`, `username`) VALUES ("' + req.body.nama + '", "' + password + '",  "' + date.toLocaleString() + '" , "' + req.body.email + '", "' + req.body.username + '")');
        if(!newUser){
            res.send("Faulure");
        }
        else{
            req.flash('info', 'Akun anda sudah berhasil didaftarkan silahkan login');
            res.redirect('/login')
        }
    }
};