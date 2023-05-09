const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

exports.signUp = async (req, res, next) => {
    try {
        const {username, password} = req.body
        const hashpassword = await bcrypt.hash(password, 12)
        const user = await User.create({
            username,
            password: hashpassword
        })
        req.session.user =  JSON.stringify(user);
        res.status(201).json({
            status: "success",
            data: { user}
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

exports.logIn = async (req, res, next) => {
console.log("first")
    try{
        const {username, password} = req.body
        req.session.username = username
            console.log("see",req.session)
        const user = await User.findOne({username: req.body.username})
        if(!user){
            return res.status(404).json({status: "fail", message: "User not found"})
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword){
            return res.status(401).json({status: "fail", message: "Invalid password"})
        }
        if(validPassword){
            req.session.user = user; 
          return res.status(200).json({status: "success"})

        }
      
    }catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}