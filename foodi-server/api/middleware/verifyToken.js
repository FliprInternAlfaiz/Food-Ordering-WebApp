//verify jwt token middleware
const jwt = require('jsonwebtoken');

const verifyToken=(req,res,next)=>{
    if(!req.headers.authorization){
     return res.status(401).send({message:"Unauthorized Token"});
    }    
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token,process.env.ACCESS_TOKEN_SECREET,(err,decoded)=>{
        if(err){
            res.status(401).send({message:"Token is Invalid"});
        }
        req.decoded = decoded;
        next();
    }
)
    console.log(token);
}

module.exports = verifyToken