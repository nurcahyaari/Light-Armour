module.exports = {
    getTransactions : async (req, res, next) => {
        let pages = 0;
        let no = 0;
        let getPendingTransactions = new Object;
        let getSuccessTransactions = new Object;
        let getPaidOffTransactions = new Object;
        let getTransactions = new Object;
        if(req.query.no){
            pages = (req.query.no) * 10;
            no = req.query.no;
        }
        if(req.params.typeActions === "pending"){
            getPendingTransactions = await req.db.query(`SELECT * FROM la_transaction WHERE transferImage = "" LIMIT ${pages}, 10`);
            console.log(getPendingTransactions);
            getTransactions = {
                "data" : getPendingTransactions,
                "length" : getPendingTransactions.length,
                "no" : parseInt(no)
            }
        }
        else if(req.params.typeActions === "success"){
            getSuccessTransactions = await req.db.query(`SELECT * FROM la_transaction WHERE status = 1 LIMIT ${pages}, 10`);
            console.log(getSuccessTransactions);
            getTransactions = {
                "data" : getSuccessTransactions,
                "length" : getSuccessTransactions.length,
                "no" : parseInt(no)
            }
        }
        else if(req.params.typeActions === "paidoff"){
            getPaidOffTransactions = await req.db.query(`SELECT * FROM la_transaction WHERE status <> 1 AND transferImage <> "" LIMIT ${pages}, 10`);
            console.log(getPendingTransactions);
            getTransactions = {
                "data" : getPaidOffTransactions,
                "length" : getPaidOffTransactions.length,
                "no" : parseInt(no)
            }
        }
        res.render('listTransactions', {
            user : {
                name : "req.session.userInfo.nama",
                username : "req.session.userInfo.username"
            },
            data : getTransactions,
            params : req.params.typeActions
            // images : productImage
        })
    }
}