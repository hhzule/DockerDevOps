const express = require("express")

const authController = require("../controllers/authController")

const router = express.Router()

// localhost:3000/      ("posts", would be striped out in both)
router.post("/signup",authController.signUp)
router.post("/login",authController.logIn)


module.exports = router