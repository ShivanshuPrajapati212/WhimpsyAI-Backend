require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {SYSTEM_PROMPT} = require("../helpers/prompts.helper.js")

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: SYSTEM_PROMPT, generationConfig: {
    responseMimeType: "application/json", temperature: 0.8}});


const generateTopic = async (interests, learnedTopics) =>{
    
   try {
     const prompt = {
         type: "user",
         interests: interests,
         learnedTopics
     };
     const result = await model.generateContent(JSON.stringify(prompt), {
         generationConfig: {
             maxOutputTokens: 500,
         }
     })
 
     const res = await JSON.parse(result.response.text())
 
     return res.topic
   } catch (error) {
    return error
   }
}

// generateTopic(['web', 'mern']).then(e => console.log(e))
// { title: 'Next.js', keyword: 'Next.js React' }

module.exports = { generateTopic }