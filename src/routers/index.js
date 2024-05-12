const { Router } = require("express");
const { handleJWTVerification } = require("../middlewares/jwt.middleware");
const authRouter = require("./auth.router");
const conversationRouter = require("./conversation.router");
const messageRouter = require("./mesage.router");
const promptRouter = require("./prompt.router");
const userRouter = require("./users.router");
// const { handleJWTVerification } = require("../middleware/jwt.middleware");

const router = Router();

router.use("/auth", authRouter)
router.use(handleJWTVerification)
router.use("/prompt",promptRouter)
router.use("/conversations",conversationRouter)
router.use("/users",userRouter)
router.use("/messages",messageRouter)


module.exports = router
