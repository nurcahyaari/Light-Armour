let arrayOfTransaksiSession = new Array();
let HowMuchFunctionCount = 0

module.exports = {
    isNull: (data, req, res, next, row) => {
        let isNeedToPush = Boolean;
        let inDB = Number;
        let inSession = Number;
        let arrayTmp = new Array();
        let checkDataInSeNDb = Number;
    
        insertToDB = "INSERT INTO la_userCart (username, id_barang, jumlah, size) VALUES "
        console.log("panjang data :  " + data.length);
        console.log("\n Data : " + JSON.stringify(req.session.TransaksiSession));
        console.log('\n data di DB  : ' + JSON.stringify(data));
        for(var i = 0; i < data.length; i++){
            checkDataInSeNDb = 1;
            for(var j = 0; j < req.session.TransaksiSession.length; j++){
                if(req.session.TransaksiSession[j].id == data[i].id_barang){
                    checkDataInSeNDb++;
                    isNeedToPush = false;
                    data[i].jumlah += req.session.TransaksiSession[j].jumlah;
                    arrayTmp.push({id:data[i].id_barang, jumlah:data[i].jumlah, nama : req.session.TransaksiSession[j].nama, harga : req.session.TransaksiSession[j].harga, size : data[i].size})
                    req.session.TransaksiSession.splice( req.session.TransaksiSession.indexOf(req.session.TransaksiSession[j]), 1 );
                    console.log("Panjang db : " + data.length)
                    console.log("Panjang session : " + req.session.TransaksiSession.length);
                    continue;
                }
                else{
                    if(checkDataInSeNDb == 1){
                        isNeedToPush = true;
                    }
                    if((i+1) == data.length){
                        arrayTmp.push({id:req.session.TransaksiSession[j].id, jumlah:req.session.TransaksiSession[j].jumlah, nama : req.session.TransaksiSession[j].nama, harga : req.session.TransaksiSession[j].harga, size : req.session.TransaksiSession[j].size})
                    }
                    // req.session.TransaksiSession.splice( req.session.TransaksiSession.indexOf(req.session.TransaksiSession[j]), 1 );
                    continue;
                }
                // checkDataInSeNDb++;
            }
            if(isNeedToPush){
                for(let j = 0; j < req.session.TransaksiSession.length; j++){
                    arrayTmp.push({id:data[i].id_barang, jumlah:data[i].jumlah, size : data[i].size, nama : data[i].namabarang, harga : data[i].harga});
                }
                isNeedToPush = false;
            }
        }
        console.log('Data nya : ' + JSON.stringify(arrayTmp));
        for(var i = 0; i < arrayTmp.length; i++){
            if((i+1) != arrayTmp.length){
                insertToDB += "('" + row[0].username + "','" + arrayTmp[i].id + "'," + arrayTmp[i].jumlah + ", '" + arrayTmp[i].size + "'), "
            }
            else{
                insertToDB += "('" + row[0].username + "','" + arrayTmp[i].id + "'," + arrayTmp[i].jumlah + ", '" + arrayTmp[i].size + "')"
            }
        }
        console.log("Data where user have a data in database so i merged it : " + insertToDB + "\n");
        return insertToDB;
    },
    pushToSession : (req, data) => {
        let arrayTransaksiInCart = new Array();
        for(var i = 0; i < data.length; i++){
            arrayTransaksiInCart.push({id: data[i].id_barang, jumlah: data[i].jumlah, size : data[i].size, nama : data[i].namabarang, harga : data[i].harga});
        }
        req.session.TransaksiSession = arrayTransaksiInCart;
        
    },
    stringQuery : (req) => {
        console.log(req.session.TransaksiSession);
        insertToDB = "INSERT INTO la_userCart (username, id_barang, jumlah, size) VALUES ";
        for(var i = 0; i < req.session.TransaksiSession.length; i++){
            if((i+1) != req.session.TransaksiSession.length){
                insertToDB += "('" + req.session.userLogin.username + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + ",  '" + req.session.TransaksiSession[i].size + "'), "
            }
            else{
                insertToDB += "('" + req.session.userLogin.username + "','" + req.session.TransaksiSession[i].id + "'," + req.session.TransaksiSession[i].jumlah + ",  '" + req.session.TransaksiSession[i].size + "')"
            }
        }
        console.log("StringQuery " + insertToDB);
        return insertToDB;
    },
    CheckJumlah : async (req) => {
        if(req.session.TransaksiSession){
            for(var i = 0; i < req.session.TransaksiSession.length; i++){
                HowMuchFunctionCount += req.session.TransaksiSession[i].jumlah;
            }
            req.session.CountOfTransaction = HowMuchFunctionCount;
            HowMuchFunctionCount = 0;
        }
    }

};