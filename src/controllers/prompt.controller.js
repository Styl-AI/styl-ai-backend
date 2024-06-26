const { generateRecommendations, getGoogleSearchResults, combineUserQueriesToSingle, researchOnTopic, extractUserPersonalizationData } = require("../config/prompt.config");
const Conversation = require("../models/conversation.modal");
const Messages = require("../models/messages.modal");
const Prompt = require("../models/prompt.modal");
const User = require("../models/user.model");
const { createOrUpdateNewConversation } = require("../utils/utils.conversation");

/**
 * Responds to user queries by generating AI replies based on the provided prompt, user ID, and conversation ID.
 * Also extracts personalized data from the prompt and updates the user's personalized data if available.
 * 
 * @param {Object} req - The request object containing the prompt, user ID, and conversation ID in the body.
 * @param {Object} res - The response object to send back the generated AI replies and status.
 * @returns {Object} JSON response indicating the status and the result containing AI responses and updated conversation details.
 */
async function generatingAIReplies(req, res) {
  try {
    const { prompt = '', userId = '', conversationId = '' } = req.body;

    const response = await generateRecommendations(prompt);
    if(prompt && userId){
      await extractPersonalizedData(prompt,userId)
    }
    const aiResponse = response?.choices[0]?.message?.content ? JSON.parse(response.choices[0].message.content) : null;
    
    let updatedResponse = { google_search_response: [], user_query: prompt, ai_response:aiResponse };

    if (aiResponse && aiResponse.google_searchable === "yes") {
      const googleSearchResp = await getGoogleSearchResults(prompt);
      updatedResponse.google_search_response = googleSearchResp;
    }

    const updatedRes = await createOrUpdateNewConversation({ conversationId, userId, updatedResponse,prompt });
    if (updatedResponse?.google_search_response?.length > 0) {
      updatedResponse = addChatIdToResponse(updatedResponse, updatedRes["messageId"]);
      await Messages.updateOne({ _id: updatedRes["messageId"] }, { $set: { conversation: updatedResponse }});
  }
    return res.status(200).json({ status: true, result: updatedResponse,updatedRes });
  } catch (error) {
    console.error("Error while retrieving user's replies", error);
    return res.status(200).json({ status: false, result: {} });
  }
}




function addChatIdToResponse(responseArray, chatId) {
  try {
      responseArray.google_search_response.forEach(item => {
          if (!item.chatId) {
              item.chatId = chatId;
          }
      });
      return responseArray;
  } catch (error) {
      console.error("Error adding chatId to response:", error);
      return responseArray;
  }
}


async function extractPersonalizedData(prompt,userId){
  try {
    const response = await extractUserPersonalizationData(prompt);
    if(response){
      const aiResponse = response?.choices[0]?.message?.content ? JSON.parse(response.choices[0].message?.content) : null;
      if(aiResponse && aiResponse?.personalized_data  !="no"){
        await User.findByIdAndUpdate(userId,{ $push: { "user_personalized_data": aiResponse } })
      }
    }
    return true
  } catch (error) {
    console.log("error whileextracting and storing personalized data", error)
    return false
  }
}



/**
 * Retrieves product recommendations based on user queries or prompts, and updates the conversation with the results.
 * 
 * @param {Object} req - The request object containing the user queries, prompt, conversation ID, and user ID in the body.
 * @param {Object} res - The response object to send back the generated product recommendations and status.
 * @returns {Object} JSON response indicating the status and the result containing product recommendations and updated conversation details.
 */
async function productRecommender(req, res) {
  try {
    // Destructure request body
    const { userQueries = [], prompt = '', conversationId = '', userId = '' } = req.body;
    
    // If user queries exist : COMMENTED BUT CAN BE USED IN FUTURE
    // if (userQueries.length > 0) {
    //   // Combine user queries into a single request
    //   const combinedRes = await combineUserQueriesToSingle(userQueries);
      
    //   // Extract content if available
    //   const content = combinedRes?.choices?.[0]?.message?.content;
      
    //   // If content is available
    //   if (content) {
    //     // Parse content to get user query
    //     const parsedContent = JSON.parse(content);
    //     const userQuery = parsedContent?.user_query;
        
    //     // If user query exists
    //     if (userQuery) {
    //       // Get Google search results and AI recommendations
    //       const googleSearchResp = await getGoogleSearchResults(userQuery);
    //       const aiReplied = await generateRecommendations(userQuery);
          
    //       // Combine responses and send the result
    //       const updatedResponse = { ...aiReplied, google_search_response: googleSearchResp };
    //       await createOrUpdateNewConversation({ conversationId, userId, updatedResponse });
    //       return res.status(200).json({ status: true, result: updatedResponse });
    //     }
    //   }
    // }
    
    // If prompt is provided
    if (prompt) {
      // Get Google search results and AI recommendations
      const googleSearchResp = await getGoogleSearchResults(prompt);
      const aiReplied = await generateRecommendations(prompt);
      const aiResponse = aiReplied?.choices[0]?.message?.content ? JSON.parse(aiReplied.choices[0].message.content) : null;
      // Combine responses and send the result
      let updatedResponse = { google_search_response: googleSearchResp, user_query: prompt, ai_response: aiResponse };
      const updatedRes = await createOrUpdateNewConversation({ conversationId, userId, updatedResponse,prompt });
      if (updatedResponse?.google_search_response?.length > 0) {
        updatedResponse = addChatIdToResponse(updatedResponse, updatedRes["messageId"]);
        await Messages.updateOne({ _id:  updatedRes["messageId"] }, { $set: { conversation: updatedResponse }});
    }
      return res.status(200).json({ status: true, result: updatedResponse,updatedRes});
    }
    
    // If neither user queries nor prompt is provided
    return res.status(200).json({ status: false, result: {} });
  } catch (error) {
    // Handle errors
    console.error("Error while generating product recommendation list:", error);
    return res.status(500).json({ status: false, result: {}, error: "Internal Server Error" });
  }
}



/**
 * Generates product research based on the provided prompt and updates the conversation with the results.
 * 
 * @param {Object} req - The request object containing the prompt, conversation ID, and user ID in the body.
 * @param {Object} res - The response object to send back the generated product research and status.
 * @returns {Object} JSON response indicating the status and the result containing product research details and updated conversation details.
 */
async function generateProductResearch(req, res) {
  try {
    const {prompt ='',conversationId='',userId='',} = req.body;
    const response = await researchOnTopic(prompt)
    if(response){
      const aiResponse = response?.choices[0]?.message?.content ? JSON.parse(response.choices[0].message.content) : null;
      const updatedResponse = { google_search_response: [], user_query: prompt, ai_response: aiResponse };
      const updatedRes = await createOrUpdateNewConversation({ conversationId, userId, updatedResponse,prompt });
      return res.status(200).json({status: true, result: updatedResponse,updatedRes});
    }
    return res.status(200).json({status: false, result: {}});

  } catch (error) {
    console.log("error while generating product research", error)
    return res.status(200).json({status: false, result: {}});
  }
}



/**
 * Retrieves the list of prompts, accessible only to users with an 'admin' role.
 * 
 * @param {Object} req - The request object containing the user ID in the body.
 * @param {Object} res - The response object to send back the list of prompts and status.
 * @returns {Object} JSON response indicating the status and the list of prompts.
 */
async function retrievePromptDetails(req, res){
  try {
      const {userId=''} = req.body 
      const findUser = await User.findById({_id: userId})
      if(findUser && findUser.role =="admin"){
           const promptsList = await Prompt.find({})
           if(promptsList && promptsList.length >0){
               return res.status(200).json({status: true, promptsList:promptsList})
           }
      }
      return res.status(200).json({status: false, promptsList:[]})
  } catch (error) {
      console.error("error while retrieving prompts list",error);
      return res.status(200).json({status: false, promptsList:[]})
  }
}




/**
 * Updates a prompt, accessible only to users with an 'admin' role.
 * 
 * @param {Object} req - The request object containing the user ID, prompt ID, and data to update in the body.
 * @param {Object} res - The response object to send back the status of the update operation.
 * @returns {Object} JSON response indicating the status of the update operation.
 */
async function updatePrompt(req, res) {
  try {
    const { userId = "", promptId = "", data } = req.body;
    const findUser = await User.findById({ _id: userId });
    if (findUser && findUser.role == "admin" && promptId && data) {
      await Prompt.findOneAndUpdate(promptId, data);
      return res.status(200).json({ status: true });
    }
    return res.status(200).json({ status: false });
  } catch (error) {
    console.error("error while updatinng prompts lists", error);
    return res.status(200).json({ status: false });
  }
}


module.exports = { generatingAIReplies,productRecommender,generateProductResearch,retrievePromptDetails,updatePrompt}