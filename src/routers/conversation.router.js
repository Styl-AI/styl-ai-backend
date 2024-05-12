const { Router } = require("express");
const { getMessagesByConversationId, getConversationList, getLinksByConversationId } = require("../controllers/conversation.controller");
const conversationRouter = Router();

conversationRouter.post('/msg-list',getMessagesByConversationId)
conversationRouter.post('/conv-list',getConversationList)
conversationRouter.post('/links-list',getLinksByConversationId)



module.exports = conversationRouter;