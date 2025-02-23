const express = require("express")
const router = express.Router()
const { body, validationResult } = require("express-validator")


const {signUp, login} = require("../../controllers/auth/auth")

router.post("/signup",[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  ], signUp
)
router.post("/login",[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  ], login
)

module.exports = router 