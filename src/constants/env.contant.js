const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env')})
module.exports.JWT_TOKEN = process.env.JWT_SECRET_KEY
module.exports.CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY
module.exports.OPEN_API_KEY = process.env.OPEN_API_KEY
module.exports.SERP_API_KEY = process.env.SERP_API_KEY
module.exports.GPT_MODAL = process.env.GPT_MODAL