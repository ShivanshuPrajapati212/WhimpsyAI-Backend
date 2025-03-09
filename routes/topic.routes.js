const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth.middleware.js")
const { getTopic, isLearnt } = require("../controllers/topic.controller.js")

router.get("/gettopic", isAuthenticated, getTopic)
router.post("/marklearnt", isAuthenticated, isLearnt)



module.exports = router