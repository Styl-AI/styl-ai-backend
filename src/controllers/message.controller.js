const Conversation = require("../models/conversation.modal");
const Messages = require("../models/messages.modal");


/**
 * Update the click count of a product based on the provided message ID and product ID.
 * Optionally, increments the conversation count if conversation ID is provided.
 * 
 * @param {Object} req - The request object containing the message ID, product ID, and optionally conversation ID in the body.
 * @param {Object} res - The response object to send back the status of the update operation.
 * @returns {Object} JSON response indicating the status of the update operation.
 *                  If successful, returns status true.
 *                  If unsuccessful or missing required IDs, returns status false.
 */
async function updateProdutClickCount(req, res) {
  try {
    const { messageId = "", productId = "",conversationId='' } = req.body;
    if (messageId && productId) {
      const findMessage = await Messages.findOne({ _id: messageId }).lean();
      
      if (
          findMessage &&
          findMessage?.conversation?.["google_search_response"] &&
          findMessage?.conversation?.["google_search_response"]?.length > 0
          ) {
              const messageDetails =
              findMessage?.conversation?.["google_search_response"];
              const productToUpdate = messageDetails.find(
                  (product) => product?.product_id === productId
                  );

              if (productToUpdate) { 
                  if (!productToUpdate.hasOwnProperty("clickCount")) {
                      productToUpdate["clickCount"] = 0; // Initialize clickCount if not present
                  }
                  productToUpdate["clickCount"] += 1; // Increment clickCount

                  await Messages.findByIdAndUpdate(
                    messageId,
                    { "conversation.google_search_response": messageDetails },
                    { new: true }
                  );
                  if(conversationId){
                    const result = await Conversation.updateOne(
                      { _id: conversationId }, 
                      { $inc: { conversationCount: 1 } }
                    );
                  }

                  return res.status(200).json({ status: true });
              }
        }
      }
    return res.status(200).json({ status: false });
  } catch (error) {
    console.error("error while updating product click count", error);
    return res.status(200).json({ status: false });
  }
}


module.exports ={updateProdutClickCount}