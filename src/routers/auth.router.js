const { Router } = require("express");
const { registerUser, logIn } = require("../controllers/auth.controller");
const authRouter = Router();

authRouter.post('/register',registerUser)
authRouter.post('/login',logIn)


module.exports = authRouter;