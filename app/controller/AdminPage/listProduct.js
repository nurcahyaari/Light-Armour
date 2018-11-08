module.exports = {
    getRenderList : async (req, res, next) => {
        let pages = 0;
        let no = 0;
        let tsirtsQuery;
        console.log(no);
        if(req.query.no){
            pages = (req.query.no) * 10;
            no = req.query.no;
        }
        console.log(req.query.no)
        if(req.params.category === "ts"){
            tsirtsQuery = await req.db.query(`SELECT * FROM la_items WHERE jenis = "baju" limit ${pages},10`);
        }
        else if(req.params.category === "js"){
            tsirtsQuery = await req.db.query(`SELECT * FROM la_items WHERE jenis = "celana" limit ${pages},10`);
        }
        if(req.params.category === "jk"){
            tsirtsQuery = await req.db.query(`SELECT * FROM la_items WHERE jenis = "jacket" limit ${pages},10`);
        }
        let tsirtSCount = tsirtsQuery.length;
        let tsirtsPr = {
            "data" : tsirtsQuery,
            "length" : tsirtSCount,
            "no" : parseInt(no)
        }
        // res.send(tsirtsPr);
        console.log(tsirtsPr);
        res.render("listProduct", {
            user : {
                name : "req.session.userInfo.nama",
                username : "req.session.userInfo.username"
            },
            "data" : tsirtsPr
        });

    },
    //  APi
    tsirtsApi : async (req, res, next) => {
        let tsirtsQuery = await db.query(`SELECT * FROM la_items WHERE jenis = "baju"`);
        let tsirtsPr = {
            "data" : tsirtsQuery
        }
        res.send(tsirtsPr);
    },

    jeansApi : async (req, res, next) => {

    },

    jacketsApi : async (req, res, next) => {
        
    }
}