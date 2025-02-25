const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  topicName: { type: String, required: true },
  summary: { type: String },
  resources: [
    {
      type: { type: String, enum: ["video", "article", "x"] },
      link: { type: String },
    },
  ],
});

const Topic = mongoose.model("topic", topicSchema);

module.exports = Topic;
