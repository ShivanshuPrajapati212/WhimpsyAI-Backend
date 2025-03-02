const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  topicName: { type: String, required: true },
  resources: [
    {
      type: { type: String, enum: ["video", "article", "x"] },
      link: { type: String },
      additionalInfo: { type: Object },
    },
  ],
  date: {
    type: Date,
    default: Date.now()
  }
});

const Topic = mongoose.model("topic", topicSchema);

module.exports = Topic;
