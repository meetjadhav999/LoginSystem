const jwt = require('jsonwebtoken')
const User = require('../models/user.js')
const auth = async (req,res,next) => {
    try{
        if(!req.header('Authorization')){
            return res.status(404).send("Authorization header not found")
        }
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.SECRET_KEY)
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})

        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch(e){
        res.send("please authenticate")
    }
}

module.exports = auth

