const User = require("../models/user.model");
const { generateAccessToken } = require("../utils/utils.jwt");


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
        console.log("error while retrieving user's list",error);
        return res.status(200).json({status: false, usersList:[]})
    }
}


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