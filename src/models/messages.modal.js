const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Random = require("meteor-random");

autoIncrement.initialize(mongoose);

const messageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `message_${Random.id()}`,
      required: true,
    },
    userId:{
        type:String,
    },
    conversationId:{
        type:String,
    },
    conversation:{
        type: Object,
        default:{}
    },
    createdAt : {
      type : Date,
      default : new Date()
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);


const Messages = mongoose.model("Messages", messageSchema);
module.exports = Messages;
