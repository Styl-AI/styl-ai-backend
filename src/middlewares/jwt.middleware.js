const User = require("../models/user.model");
const JWT = require('jsonwebtoken');
const { JWT_TOKEN } = require('../constants/env.contant');


/**
 * Decodes a JWT token using the provided secret key.
 * @param {string} token - The JWT token to decode.
 * @returns {Object|boolean} The decoded JWT payload if successful, otherwise false.
 */
function JWTDecoder(token){
  try {
    return JWT.verify(token,JWT_TOKEN);
  } catch (error) {
    return false
  }
}


/**
 * Middleware function to handle JWT verification.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
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