const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Random = require("meteor-random");

autoIncrement.initialize(mongoose);

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `user_${Random.id()}`,
      required: true,
    },
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      type: String,
      values: ["user", "admin"],
      default: "user"
    },
    user_personalized_data:{
      type : Array,
      default:[]
    }
  },
  { _id: false, timestamps: true, toJSON: { virtuals: true } }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
