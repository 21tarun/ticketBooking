const jwt = require ('jsonwebtoken')

// autentication ------------------------------------------------------------------------------
const Authentication = async function(req,res,next){
    try{
      let token = req.headers['x-api-key']; // header key
      if(!token ) return res.status(400).send({status: false, message:"Authentication token is missing"})
      jwt.verify(token, "Secret-key",function(err,decoded){
        if(err){
          return res.status(401).send({status:false, err: err.message});
        }
        else{
          req.decode = decoded
          console.log( req.decode)
          return next();
        }
      })
    }
    catch(error){
      res.status(500).send({status:false,msg:error.message})
    }
  }
  
module.exports.Authentication=Authentication
