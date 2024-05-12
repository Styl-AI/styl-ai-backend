const { Router } = require("express");
const { generatingAIReplies, productRecommender, generateProductResearch, retrievePromptDetails, updatePrompt } = require("../controllers/prompt.controller");
const promptRouter = Router();

promptRouter.post('/generate-prompt',generatingAIReplies)
promptRouter.post('/product-list',productRecommender)
promptRouter.post('/research',generateProductResearch)
promptRouter.post('/get-prompts',retrievePromptDetails)
promptRouter.post('/update-prompt',updatePrompt)

module.exports = promptRouter;