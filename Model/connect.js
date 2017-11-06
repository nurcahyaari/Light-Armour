var mysql = require('mysql');

var Connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'tokoonline'
})

Connect.connect(function(err, data){
    if(err){
        console.log('Connection failed');
    }
    else{
        console.log('Connection Success');
    }
})

module.exports = Connect;