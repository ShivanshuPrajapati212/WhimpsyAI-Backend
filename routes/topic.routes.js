const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth.middleware.js")
const { getTopic } = require("../controllers/topic.controller.js")

router.get("/gettopic", isAuthenticated, getTopic)



module.exports = router