const openai = require("openai");
const {
  OPEN_API_KEY,
  SERP_API_KEY,
  GPT_MODAL,
  PROMPT_ID,
} = require("../constants/env.contant");
const { getJson } = require("serpapi");
const { extractShoppingResults } = require("../utils/utils.ai");
const Prompt = require("../models/prompt.modal");
const DEFAULT_PROMTS = require("../json/prompts.json")
// OpenAI API key
const apiKey = OPEN_API_KEY;
// Initialize the OpenAI client
const client = new openai.OpenAI({ apiKey });


/**
 * Checks the availability of a specific prompt type in the database.
 * @param {string} promptType - The type of prompt to check availability for.
 * @returns {Object} An object indicating whether the prompt is available and, if so, the prompt data.
 */
async function checkPromptAvailability(promptType) {
  try {
    const prompt = await Prompt.findOne({}).lean();

    if (prompt && prompt.hasOwnProperty(promptType)) {
      return { havePrompt: true, prompt: prompt[promptType] };
    }
    
    return { havePrompt: false };
  } catch (error) {
    return { havePrompt: false };
  }
}


/**
 * Generates product recommendations based on user query.
 * @param {string} userInput - The user's input/query.
 * @returns {Object} A response containing product recommendations.
 */
async function generateRecommendations(userInput) {
  try {
    let PROMPT =  DEFAULT_PROMTS["reply_to_user_prompt"]
     const checkDBPrompt = await checkPromptAvailability("reply_to_user_prompt")


     if(checkDBPrompt?.havePrompt){
        PROMPT = checkDBPrompt?.prompt
     }

     const FINAL_PROMPT = `
      User Query : Here is the user query for your reference : ${userInput},
      Prompt : ${PROMPT},
      Response Format :  Answer in JSON format in below structure: 
      {
        ai_reply : "respond to user queries and never use  double inverted commas",
        google_searchable: Is it a generic user inquiry or the real product name?Use "yes" in this case if it is the product name.Use "no" in this case if the question is general.,
      }
     `

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: FINAL_PROMPT },
        { role: "user", content: userInput },
      ],
      model: GPT_MODAL,
      response_format:  {type:'json_object'},
    });

    return completion;
  } catch (error) {
    console.error("Error while  generating recommendations:", error);
    return {};
  }
}


/**
 * Retrieves Google search (shopping section) results for a given query.
 * @param {string} query - The search query.
 * @returns {Object} An object containing extracted shopping results.
 */
async function getGoogleSearchResults(query) {
  try {

    const response = await getJson({
      api_key: SERP_API_KEY,
      engine: "google_shopping",
      google_domain: "google.com",
      q: query,
    });

    if (
      response &&
      (response.shopping_results || response.related_shopping_results)
    ) {
      const finalExtractedResults = extractShoppingResults(response);
      return finalExtractedResults;
    }

    return {};
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}


/**
 * Combines multiple user queries into a single coherent query.
 * @param {Array} queries - An array of user queries to be merged.
 * @returns {Object} A response containing the merged query.
 */
async function combineUserQueriesToSingle(queries) {
  try {
    const PROMPT = `
    Your speciality lies in merging and rephrasing user queries to form cohesive and grammatically correct sentences while ensuring the context is maintained.
    Your task is to merge a set of user queries into a single coherent query while ensuring grammatical correctness. Here are the array of user queries you need to merge: ${JSON.stringify(
      queries
    )}.
    Please provide the merged query in JSON format. Your response should be structured as follows:
    {
        user_query: "your merged query"
    }
    `;

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: PROMPT },
        { role: "user", content: "your response" },
      ],
      model: GPT_MODAL,
      response_format: { type: "json_object" },
    });

    return completion;
  } catch (error) {
    console.error("Error while combining user queries to single query", error);
    return [];
  }
}



/**
 * Conducts research on a given topic and provides an AI reply.
 * @param {string} prompt - The user query or prompt related to the topic.
 * @returns {Object} A response containing the AI's research-based reply.
 */
async function researchOnTopic(prompt) {
  try {
    let PROMPT =  DEFAULT_PROMTS["search_on_topic_prompt"]
    const checkDBPrompt = await checkPromptAvailability("search_on_topic_prompt")
    
    if(checkDBPrompt?.havePrompt){
       PROMPT = checkDBPrompt?.prompt
    }


    const FINAL_PROMPT = `
    User Query : Here is the user query for your reference : ${prompt},
    Prompt : ${PROMPT},
    Response Format : Answer in JSON format in below structure: 
    {
      ai_reply : "your response and never use  double inverted commas",
    }
   `

    
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: FINAL_PROMPT },
        { role: "user", content: `Your response` },
      ],
      model: GPT_MODAL,
      response_format: {type:'json_object'}
    });
    return completion;
  } catch (error) {
    console.error("Error while researching on a topic", error);
    return [];
  }
}



/**
 * Extracts user personalization data from a given prompt or query.
 * @param {string} prompt - The user query or prompt containing personalization data.
 * @returns {Object} A response containing insights and relevant data points in JSON format, or "personalized_data":"no" if no personal data was found.
 */
async function extractUserPersonalizationData(prompt) {
  try {
    let PROMPT = DEFAULT_PROMTS["user_personalization_prompt"]

    const checkDBPrompt = await checkPromptAvailability("user_personalization_prompt")

    if(checkDBPrompt?.havePrompt && checkDBPrompt?.havePrompt != false){
       PROMPT = checkDBPrompt?.prompt
    }


    const FINAL_PROMPT = `
    User Query : Here is the user query for your reference : ${prompt},
    Prompt : ${PROMPT},
    Response Format : If the query reveals personal information, return the insights and the relevant data points in JSON format. Otherwise, return  "personalized_data":"no" to indicate no personal data was found.
   `
    
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: FINAL_PROMPT },
        { role: "user", content: "your response" },
      ],
      model: GPT_MODAL,
      response_format: {type:'json_object'},
    });
    return completion;
  } catch (error) {
    console.error("Error while researching on a topic", error);
    return [];
  }
}







module.exports = {
  generateRecommendations,
  getGoogleSearchResults,
  combineUserQueriesToSingle,
  researchOnTopic,
  extractUserPersonalizationData
};
