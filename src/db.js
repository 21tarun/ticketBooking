const mysql =require('mysql')

// var connection =mysql.createConnection({
//     host:'127.0.0.1',
//     port:3306,
//     user: 'root',
//     password: 'tarun1616',
//     database:'miniNetflix' 
// })

var connection =mysql.createConnection({
    host:'bw09w4vqhgqxpwujyagw-mysql.services.clever-cloud.com',
    port:3306,
    user: 'uo1drjwno42dtycb',
    password: 'dIkf1HjD9Y3l6B2ztisC',
    database:'bw09w4vqhgqxpwujyagw' 
})


connection.connect(function(err){
    if(err){
        console.log('error connecting '+ err.stack);
        return;
    }
    console.log("connected as id "+ connection.threadId)
})

const sql = function (sqlQuery,params){
    return new Promise((resolve,reject)=>{
        connection.query(sqlQuery,params,(err,result)=>{
            if(err){reject(new Error());}
            else{resolve(result)}
        })
    })
}

module.exports=sql