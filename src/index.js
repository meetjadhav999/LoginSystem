const express = require('express')
const path = require('path')
const userAPI = require('./api/user.js')
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_PATH)

const app = express()
app.use(express.json())



app.use('/api/users',userAPI)

app.listen(process.env.PORT ,()=>{
    console.log('Server Running on port ')
    console.log(process.env.PORT)
})