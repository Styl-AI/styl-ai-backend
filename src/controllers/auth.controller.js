const User = require("../models/user.model")
const CryptoJS = require('crypto-js')
const { generateAccessToken } = require("../utils/utils.jwt");

/**
 * Registers a new user.
 * 
 * @param {Object} req - The request object containing user data in the body.
 * @param {Object} res - The response object to send back the result.
 * @returns {Object} Returns a response indicating success or failure with appropriate message and user details.
 */
async function registerUser(req, res) {
    try {
      const { firstName='',lastName='',email='',password='',role=''} = req.body;

      // Firstly check if user is already existed or not 
      const findUser = await User.findOne({email:email});

      if (findUser && findUser["_id"]) {
        return res.status(200).send({ status: false, msg: "User Already Existed", user: {} })
      }

      const userDetails = {
        firstName : firstName,
        lastName: lastName,
        email: email,
        password:password,
        role:role
      }
  
      const newUser = new User(userDetails);
      const savedUser = await newUser.save();
      const token = generateAccessToken({ user: savedUser["_id"] , role:role });
      console.log("saved user details:", savedUser)
      return res.status(200).json({status: true, token: token, user: savedUser, msg: "User Successfully Created !!" });
  
    } catch (error) {
      console.error("error while creating a new user", error)
      return res.status(400).send({ status: false, msg: "Encountered an error while creating a new user. Please refresh the page and try again.", user: {} })
  
    }
  }


/**
* Logs in a user.
* 
* @param {Object} req - The request object containing user credentials (email and password).
* @param {Object} res - The response object to send back the result.
* @returns {Object} Returns a response indicating success or failure with appropriate message and user details.
*/
  async function logIn(req, res) {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({email:email});
      if (!user) {
        return res.status(200).send({ status: false, msg: "User not found" });
      }
  
      // Compare passwords
      const decryptedPassword = CryptoJS.AES.decrypt(password, process.env.CRYPTO_SECRET_KEY).toString();
      const decrytedActualPassword = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SECRET_KEY).toString();
      console.log("passwordpasswordpassword",{decryptedPassword, decrytedActualPassword})

  
      const passwordMatch = (decryptedPassword === decrytedActualPassword)
  
      if (!passwordMatch) {
        return res.status(200).send({ status: false, msg: "Incorrect password." });
      }
      if (user && user["_id"]) {
        // if(user.blocked){
        //   return res.status(200).json({token: null,user: {},msg: "Access Denied: User Blocked by Admin. For assistance, please reach out to the administrator."});
        // }
        const token = generateAccessToken({ user: user['_id'] });
        return res.status(200).json({ token: token, user: user, newUser: false, status: true, msg: "User LoggedIn successfully !!" });
      }
      return res.status(200).send({ status: false, user, msg: "Encountered an error while signing in. Please refresh the page and retry."});
    } catch (error) {
      console.error("Error while signing in", error);
      return res.status(200).send({ status: false, msg: "Encountered an error while signing in. Please refresh the page and retry." });
    }
  }

  module.exports = {
    registerUser,
    logIn
  }
  