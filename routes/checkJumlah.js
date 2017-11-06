let arrayOfTransaksiSession = new Array();
let HowMuchFunctionCount = 0;
CheckJumlah = (req) => {
  if(req.session.TransaksiSession){
    for(var i = 0; i < req.session.TransaksiSession.length; i++){
      HowMuchFunctionCount += req.session.TransaksiSession[i].jumlah;
    }
    req.session.CountOfTransaction = HowMuchFunctionCount;
    HowMuchFunctionCount = 0;
  }
}