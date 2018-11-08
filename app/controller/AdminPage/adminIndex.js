module.exports = {
    getIndex : async (req, res, next) => {
        let countTs = await req.db.query(`SELECT COUNT(*) as tsirts FROM la_items WHERE jenis = "baju"`);
        let countJs = await req.db.query(`SELECT COUNT(*) as jeans FROM la_items WHERE jenis = "celana"`);
        let countJk = await req.db.query(`SELECT COUNT(*) as jacket FROM la_items WHERE jenis = "jacket"`);
        console.log(countJk);
        res.render('index', {
            user : {
                name : req.session.userInfo.nama,
                username : req.session.userInfo.username
            },
            itemTotal : {
                jeans : countJs[0].jeans,
                tsirts : countTs[0].tsirts,
                jackets : countJk[0].jacket
            }
        });
    }
}