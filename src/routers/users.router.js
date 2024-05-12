const { Router } = require("express");
const { usersList, retrieveCurrentUser } = require("../controllers/user.controller");
const userRouter = Router();

userRouter.post('/users-list',usersList)
userRouter.post('/currentUser',retrieveCurrentUser)

module.exports = userRouter;