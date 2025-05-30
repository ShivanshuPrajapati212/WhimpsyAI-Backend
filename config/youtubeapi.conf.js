const axios = require("axios");
require("dotenv").config()

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const maxResults = 3

const getVideos = async (query) => {
   try {
     const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=${query}&type=video&part=snippet&relevanceLanguage=en&videoDuration=medium&maxResults=${maxResults}`)
 
     let videos = [];
 
     response.data.items.map((e)=>{
         videos.push({
          link: e.id.videoId,
          additionalInfo: {
            title: e.snippet.title,
            desc: e.snippet.description
          }
         })
     })
     return videos; 
   } catch (error) {
    return "error"
   }
}


module.exports = { getVideos }