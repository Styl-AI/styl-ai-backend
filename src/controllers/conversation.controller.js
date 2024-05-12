const Conversation = require("../models/conversation.modal");
const Messages = require("../models/messages.modal");
const Prompt = require("../models/prompt.modal");
const { groupByClickCountLinks } = require("../utils/utils.conversation");




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
     console.log("error while getting messages list from conversation",error)
     return res.status(200).json({ status: false, conversationsList: [] ,msg:"Something went wrong please try again !!"});
  }
}


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
    console.log("error while retrieveing conversation list", error);
    return res.status(200).json({status: false,list:[]})
  }
}

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
     console.log("error while getting messages list from conversation",error)
     return res.status(200).json({ status: false, clickedLinks: {} ,msg:"Something went wrong please try again !!"});
  }
}

module.exports = {
    getMessagesByConversationId,
    getConversationList,
    getLinksByConversationId
};

