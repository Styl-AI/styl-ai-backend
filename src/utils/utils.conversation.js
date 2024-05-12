const Conversation = require("../models/conversation.modal");
const Messages = require("../models/messages.modal");

async function createOrUpdateNewConversation({ conversationId = '', userId = '', updatedResponse, prompt = '' }) {
    try {
        console.log("createOrUpdateNewConversation", { conversationId, userId, updatedResponse, prompt });

        const chatDetails = { userId, conversationId, conversation: updatedResponse };
        const newChat = new Messages(chatDetails);
        const savedChat = await newChat.save();

        if (!savedChat) throw new Error("Failed to save chat");

        const resultantData = { conversationId: '', userId: '', messageId: '' };

        if (conversationId) {
            resultantData.conversationId = conversationId;
        } else {
            const newConversation = await Conversation.create({ userId, title: prompt, chats: [savedChat._id] });
            resultantData.conversationId = newConversation._id;
            await Messages.findByIdAndUpdate(savedChat._id, { conversationId: newConversation._id });
        }

        resultantData.messageId = savedChat._id;
        resultantData.userId = userId;

        console.log("createOrUpdateNewConversation saved data", resultantData);
        
        return resultantData.conversationId ? resultantData : false;
    } catch (error) {
        console.error("Error while creating or updating new conversation:", error);
        return false;
    }
}


function groupByClickCountLinks(conversationsList) {

    try {
        const groupedResponses = [];
    
        conversationsList?.forEach(conversation => {
            conversation?.conversation?.google_search_response?.forEach(response => {
                if (response?.clickCount > 0) {
                    groupedResponses.push(response);
                }
            });
        });
    
        return groupedResponses;
        
    } catch (error) {
        console.log("error while grouping up click count events",error);
        return {}
    }
}

module.exports = { createOrUpdateNewConversation,groupByClickCountLinks };
