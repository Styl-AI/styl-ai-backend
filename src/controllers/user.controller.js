const User = require("../models/user.model");
const { generateAccessToken } = require("../utils/utils.jwt");


/**
 * Retrieve the list of users based on the provided user ID.
 * This endpoint is accessible only to users with an 'admin' role.
 * 
 * @param {Object} req - The request object containing the user ID in the body.
 * @param {Object} res - The response object to send back the user list or error message.
 * @returns {Object} JSON response indicating the status and the list of users.
 *                  If successful, returns status true and an array of user objects.
 *                  If unsuccessful or unauthorized, returns status false and an empty array.
 */
async function usersList(req, res){
    try {
   
        const {userId=''} = req.body 
        const findUser = await User.findById({_id: userId})
        if(findUser && findUser.role =="admin"){
             const usersList = await User.find({role:"user"}).select('firstName lastName email user_personalized_data _id').sort({createdAt:-1})
             if(usersList && usersList.length >0){
                 return res.status(200).json({status: true, usersList:usersList})
             }
        }
        return res.status(200).json({status: false, usersList:[]})
    } catch (error) {
        console.error("error while retrieving user's list",error);
        return res.status(200).json({status: false, usersList:[]})
    }
}


/**
 * Retrieve the details of the current user based on the provided user ID.
 * 
 * @param {Object} req - The request object containing the user ID in the body.
 * @param {Object} res - The response object to send back the user details or error message.
 * @returns {Object} JSON response indicating the status, token, and user details.
 *                  If successful, returns status true, a token for authentication, user details, and a success message.
 *                  If unsuccessful or missing user ID, returns status false, null token, an empty user object, and no message.
 */
async function retrieveCurrentUser(req, res) {
    try {
  
      const { userId = '' } = req.body
      if (userId) {
        const findUser = await User.findById({ _id : userId});
        if (findUser && findUser["_id"]) {
        
          const token = generateAccessToken({ user: userId });
          return res.status(200).json({status: true, token: token, user: findUser, msg: "User Successfully Retrieved !!" });
        }
      }
      return res.status(200).json({ token: null, user: {}, status: false});
  
    } catch (error) {
      console.error("error while retrieving current user", { error, data: req.body });
      return res.status(200).json({ token: null, user: {}, status: false})
  
    }
  }


module.exports={usersList,retrieveCurrentUser}