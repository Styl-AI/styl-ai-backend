const Conversation = require("../models/conversation.modal");
const Messages = require("../models/messages.modal");


/**
 * Creates or updates a conversation and its associated messages in the database.
 * @param {Object} options - Object containing conversation and user details.
 * @param {string} options.conversationId - The ID of the conversation (optional).
 * @param {string} options.userId - The ID of the user associated with the conversation.
 * @param {string} options.updatedResponse - The updated response for the conversation.
 * @param {string} options.prompt - The prompt/title associated with the conversation.
 * @returns {Object|boolean} An object containing conversation, user, and message IDs if successful, otherwise false.
 */
async function createOrUpdateNewConversation({ conversationId = '', userId = '', updatedResponse, prompt = '' }) {
    try {
        
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
        
        return resultantData.conversationId ? resultantData : false;
    } catch (error) {
        console.error("Error while creating or updating new conversation:", error);
        return false;
    }
}

/**
 * Groups links based on their click count from a list of conversations.
 * @param {Array} conversationsList - List of conversations to analyze.
 * @returns {Array} An array of links grouped by their click count.
 */
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
        console.error("error while grouping up click count events",error);
        return {}
    }
}

module.exports = { createOrUpdateNewConversation,groupByClickCountLinks };
