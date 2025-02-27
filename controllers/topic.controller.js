const Topic = require("../models/Topic.model.js");
const {generateTopic} = require("../config/gemini.conf.js")

const getTopic = async (req, res) => {
  try {
    const { interests, learnedTopics } = req.user;

    if (!interests) {
      return res.status(400).json({ error: "Insufficient Data" });
    }

    const id = req.user._id.toString();

    const result = await generateTopic(interests, learnedTopics)

    const topic = Topic.create({
        topicName: result.topic,
        
    })

    return res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: "Internal Server error" });
  }
};

module.exports = { getTopic };
