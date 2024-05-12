// async function updateProductClickCount(response) {
//     try {
//         const products = response.conversation.google_search_response;
//         const productIdToUpdate = '3942827788408882937'; // Example product ID to update
//         const messageID = response._id; // Assuming you have a unique identifier for the message

const Conversation = require("../models/conversation.modal");
const Messages = require("../models/messages.modal");

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
              console.log("find Messages", productToUpdate);
              if (productToUpdate) { // Check if productToUpdate is not undefined
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
    console.log("error while updating product click count", error);
    return res.status(200).json({ status: false });
  }
}


module.exports ={updateProdutClickCount}