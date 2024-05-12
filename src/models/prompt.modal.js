const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Random = require("meteor-random");

autoIncrement.initialize(mongoose);

const promptSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `prompt_${Random.id()}`,
      required: true,
    },
    reply_to_user_prompt: {
      type: String,
    },
    search_on_topic_prompt: {
      type: String,
    },
    user_personalization_prompt: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const Prompt = mongoose.model("Prompts", promptSchema);
module.exports = Prompt;
