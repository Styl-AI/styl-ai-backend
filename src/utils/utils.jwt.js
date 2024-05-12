const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env')})

const JWT = require('jsonwebtoken');
const { JWT_TOKEN } = require('../constants/env.contant');

function generateAccessToken(data) {
    try {
      return JWT.sign(data, JWT_TOKEN, { expiresIn: '14400s' });
    } catch (error) {
      console.log("error while generating access token",error)
      return false
    }
}

module.exports = { generateAccessToken }