const Conversation = require("../models/conversation.modal");
const Messages = require("../models/messages.modal");
const Prompt = require("../models/prompt.modal");
const { groupByClickCountLinks } = require("../utils/utils.conversation");




/**
 * Retrieves messages associated with a specific conversation ID and user ID.
 * 
 * @param {Object} req - The request object containing the conversation ID and user ID in the body.
 * @param {Object} res - The response object to send back the messages list and status.
 * @returns {Object} JSON response indicating the status and the list of messages for the conversation.
 */
async function getMessagesByConversationId(req,res){
  try {
    const {conversationId='', userId=''} =  req.body

    if(conversationId && userId){
       const conversationResp = await Messages.find({conversationId});
       if(conversationResp && conversationResp.length >0){
            return res.status(200).json({ status: true, conversationsList: conversationResp, msg:"Conversation Successfully Loaded !!" });
       }
    }

    return res.status(200).json({ status: false, conversationsList: [] ,msg:"Something went wrong please try again !!"});

    
  } catch (error) {
     console.error("error while getting messages list from conversation",error)
     return res.status(200).json({ status: false, conversationsList: [] ,msg:"Something went wrong please try again !!"});
  }
}


/**
 * Retrieves the list of conversations associated with a specific user ID.
 * 
 * @param {Object} req - The request object containing the user ID in the body.
 * @param {Object} res - The response object to send back the conversation list and status.
 * @returns {Object} JSON response indicating the status and the list of conversations for the user.
 */
async function getConversationList(req,res){
  try {
    const { userId=''} = req.body
    
    if(userId){
       const convList = await Conversation.find({userId}).select('title userId _id createdAt conversationCount').sort({ createdAt: -1 });
       if(convList && convList.length >0){
           return res.status(200).json({status: true,list:convList})
       }
    }
    return res.status(200).json({status: false,list:[]})

    
  } catch (error) {
    console.error("error while retrieveing conversation list", error);
    return res.status(200).json({status: false,list:[]})
  }
}


/**
 * Retrieves clicked links associated with a specific conversation ID and user ID.
 * 
 * @param {Object} req - The request object containing the conversation ID and user ID in the body.
 * @param {Object} res - The response object to send back the clicked links list and status.
 * @returns {Object} JSON response indicating the status and the list of clicked links for the conversation.
 */

async function getLinksByConversationId(req,res){
  try {
    const {conversationId='', userId=''} =  req.body

    if(conversationId && userId){
       const conversationResp = await Messages.find({conversationId,userId});
       if(conversationResp && conversationResp?.length >0){
            const response  = groupByClickCountLinks(conversationResp)
            return res.status(200).json({ status: true, clickedLinks: response, msg:"Conversation Successfully Loaded !!" });
       }
    }

    return res.status(200).json({ status: false, clickedLinks: {} ,msg:"Something went wrong please try again !!"});

    
  } catch (error) {
     console.error("error while getting messages list from conversation",error)
     return res.status(200).json({ status: false, clickedLinks: {} ,msg:"Something went wrong please try again !!"});
  }
}

module.exports = {
    getMessagesByConversationId,
    getConversationList,
    getLinksByConversationId
};

