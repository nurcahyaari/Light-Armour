let crypto = require('crypto');
let secret = 'jdmforlife';

module.exports = {
    index : async (req, res, next) => {
        if(!req.session.userInfo){
            res.redirect('/login');
        }
        else{
            next();
        }
    },

    getLogin : async (req, res, next) => {
        res.render('login');
    },

    postLogin : async (req, res, next) => {
        let password = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
        let adminQuery = await req.db.query(`SELECT * FROM la_admin WHERE username = "${req.body.username}" AND password = "${password}"`);
        console.log(adminQuery[0].username);
        req.session.userInfo = {
            'username' : adminQuery[0].username,
            'nama'     : adminQuery[0].nama,
            'status'   : 'loggedin'
        }
        res.redirect('/');
    },

    getLogout : async (req, res, next) => {
        req.session.destroy();
        res.redirect('/login');
    }
}