const { Router } = require("express");
const { updateProdutClickCount } = require("../controllers/message.controller");

const messageRouter = Router();

messageRouter.post('/update-click-count',updateProdutClickCount)



module.exports = messageRouter;