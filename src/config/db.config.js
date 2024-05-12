const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, 'src/.env') });

// Define MongoDB connection URI: (For Localhost)
let MONGO_URI = `mongodb://${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DB}`;

// Check if connection type is for production
if (process.env.CONNECTION_TYPE === "production") {
  // If production, use MongoDB Atlas connection URI
  MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DB}`
             + `?authSource=admin&replicaSet=${process.env.MONGO_REPLICA}&tls=true&tlsCAFile=${process.env.CRT_PATH}`;
}

console.log("MONGO URL CONNECTION :", MONGO_URI);

mongoose.connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error while establishing connection with MongoDB:", err);
  });


mongoose.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    // Convert _id to id and remove unnecessary fields
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    // Remove password field from User documents
    if (doc.constructor.modelName === "User") {
      delete ret.password;
    }
    return ret;
  },
});
