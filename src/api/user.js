const express = require('express')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')

const router = express.Router()


router.get('/me',auth,(req,res)=>{
    res.send(req.user)
})

router.post('/login',async(req,res)=>{
    try{
        if(!req.body.email || !req.body.password){
            res.status(400).send("email or password is not provided")
        }
        const user = await User.authenticate(req.body.email,req.body.password) 
        await user.generateAuthToken()
        res.send(user)

    }catch(e){
        res.status(400).send('error')
    }
})

router.post('/register', async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send('invalid data')
    }
})

router.post("/logout",auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.post('/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})


router.delete('/me',auth,async(req,res)=>{
    try{
        await req.user.deleteOne()
        res.send(req.user)
    }catch(e){
        res.status(400).send('error')
    }
})

router.patch('/me',auth,async(req,res)=>{
    try{
        if(!req.body.CurPassword || !req.body.NewPassword){
            return res.status(400).send("invalid request")
        }
        const user = await User.authenticate(req.user.email,req.body.CurPassword)
        user.password = req.body.NewPassword
        await user.save()
        res.send(user)
    }catch(e){

    }
})

module.exports = router