const axios = require("axios")
require("dotenv").config()

const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;

const getArticles = async (query) =>{
    const res = await axios.get(`https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=415d944dd50b849a5&q=${query}&num=5`)

    let sites = []

    res.data.items.map((e)=> {
        sites.push({
            link: e.link,
            additionalInfo: {
                title: e.title,
                desc: e.snippet
            }
        })
    })

    return sites
}

module.exports = { getArticles }