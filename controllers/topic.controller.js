const Topic = require("../models/Topic.model.js");
const User = require("../models/User.model.js")
const {generateTopic} = require("../config/gemini.conf.js");
const { getVideos } = require("../config/youtubeapi.conf.js");

const getTopic = async (req, res) => {
  try {
    const { interests, learnedTopics } = req.user;

    if (!interests) {
      return res.status(400).json({ error: "Insufficient Data" });
    }

    let user = await User.findById(req.user._id)

    const result = await generateTopic(interests, learnedTopics)
    const videos = await getVideos(result.keyword)

    let resources = []

    videos.map(e => resources.push({type: "video", link: e}))

    const topic = new Topic({
        user: req.user._id,
        topicName: result.title,
        resources: resources
    })

    const savedTopic = await topic.save()

    const updatedUser = user;
    updatedUser.learnedTopics.push(result.title)

    await User.findOneAndUpdate(req.user._id, {$set: updatedUser}, {new: true})

    return res.status(200).json(savedTopic);
  } catch (error) {
    res.status(400).json({ error: "Internal Server error" });
  }
};

module.exports = { getTopic };
