const express = require("express");
const {updateUser} = require("../controllers/user.controller.js")
const { isAuthenticated } = require("../middleware/auth.middleware.js")

const router = express.Router();

router.post("/updateuser", isAuthenticated, updateUser)


module.exports = router