var Auth = {
    check_login: (req, res, next) =>{
        if (!req.session.userLogin) {
            return res.redirect('/login');
        }
        next();
    }
};


module.exports = Auth;