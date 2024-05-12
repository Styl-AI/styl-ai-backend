const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Random = require("meteor-random");

autoIncrement.initialize(mongoose);

const conversationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `conversation_${Random.id()}`,
      required: true,
    },
    userId:{
        type:String,
    },
    chats: {
      type: Array,
      default: [],
    },
    title:{
      type: String
    },
    conversationCount:{
      type: Number,
      default:0
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
