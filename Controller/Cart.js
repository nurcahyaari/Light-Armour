let Cart = {
    isNull: (data, req, res, next, row) => {
        let isNeedToPush = Boolean;
        let inDB = Number;
        let inSession = Number;
        let arrayTmp = new Array();
        let checkDataInSeNDb = Number;
    
        insertToDB = "INSERT INTO la_userCart (username, id_barang, jumlah) VALUES "
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
                    arrayTmp.push({id:data[i].id_barang, jumlah:data[i].jumlah})
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
                        arrayTmp.push({id:req.session.TransaksiSession[j].id, jumlah:req.session.TransaksiSession[j].jumlah})
                    }
                    // req.session.TransaksiSession.splice( req.session.TransaksiSession.indexOf(req.session.TransaksiSession[j]), 1 );
                    continue;
                }
                // checkDataInSeNDb++;
            }
            if(isNeedToPush){
                arrayTmp.push({id:data[i].id_barang, jumlah:data[i].jumlah});
                isNeedToPush = false;
            }
        }
        console.log('Data nya : ' + JSON.stringify(arrayTmp));
        for(var i = 0; i < arrayTmp.length; i++){
            if((i+1) != arrayTmp.length){
                insertToDB += "('" + row[0].username + "','" + arrayTmp[i].id + "'," + arrayTmp[i].jumlah + "), "
            }
            else{
                insertToDB += "('" + row[0].username + "','" + arrayTmp[i].id + "'," + arrayTmp[i].jumlah + ")"
            }
        }
        console.log("Data where user have a data in database so i merged it : " + insertToDB + "\n");
        return insertToDB;
    },
    pushToSession : (req, data, arrayTransaksiInCart) => {
        for(var i = 0; i < data.length; i++){
            arrayTransaksiInCart.push({id: data[i].id_barang, jumlah: data[i].jumlah});
        }
        req.session.TransaksiSession = arrayTransaksiInCart;
        
    }
}

module.exports = Cart;