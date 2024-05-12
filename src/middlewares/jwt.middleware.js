const User = require("../models/user.model");
const JWT = require('jsonwebtoken');
const { JWT_TOKEN } = require('../constants/env.contant');


function JWTDecoder(token){
  try {
    return JWT.verify(token,JWT_TOKEN);
  } catch (error) {
    return false
  }
}

async function handleJWTVerification(req, res, next){
    try {
  
      let token = req.headers.authorization;
      token = token.split(" ")[1]
      const jwtDecoder = JWTDecoder(token)
      if(jwtDecoder){
        const userId  = jwtDecoder["user"]
        if(userId){
           const userResp = await User.findById(userId).lean();
           if(userResp && userResp?.email){
              return next();
           }
        }
      }
      return res.send({status : false , message : "Unauthorized Access"})
    }catch(error){
        console.log("error while verification of jwt", error);
        return res.send({status : false , message : "Unauthorized Access"})
    }
  };


module.exports ={handleJWTVerification}