const Topic = require("../models/Topic.model.js");
const User = require("../models/User.model.js")
const {generateTopic} = require("../config/gemini.conf.js");
const { getVideos } = require("../config/youtubeapi.conf.js");
const { getArticles } = require("../config/search.conf.js");
const { isMoreThan24Hours } = require("../helpers/time.helper.js");

const getTopic = async (req, res) => {
  try {
    const { interests, learnedTopics } = req.user;

    if (!interests) {
      return res.status(400).json({ error: "Insufficient Data" });
    }

    const oldTopic = await Topic.findOne({user: req.user._id})


    if(oldTopic && !isMoreThan24Hours(oldTopic.date)){
      console.log("old")
      return res.status(200).json(oldTopic);
    }

    let user = await User.findById(req.user._id)

    const result = await generateTopic(interests, learnedTopics)
    const videos = await getVideos(result.keyword)
    const sites = await getArticles(result.keyword)

    let resources = []

    videos.map(e => resources.push({type: "video", link: e.link, additionalInfo: e.additionalInfo}))
    sites.map(e => resources.push({type: "article", link: e.link, additionalInfo: e.additionalInfo}))

    const topic = new Topic({
        user: req.user._id,
        topicName: result.title,
        resources: resources
    })

    const savedTopic = await topic.save()

    const updatedUser = user;
    updatedUser.learnedTopics.push(result.title)

    await User.findOneAndUpdate(req.user._id, {$set: updatedUser}, {new: true})
    console.log("new")
    return res.status(200).json(savedTopic);
  } catch (error) {
    res.status(400).json({ error: "Internal Server error" });
  }
};

module.exports = { getTopic };
