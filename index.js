require("dotenv").config();
 const express = require('express')
 const mongoose = require('mongoose')
 const cors = require('cors')

 const app= express()

 app.use(express.json())
 app.use(cors())
 const PORT = process.env.PORT;
 const MONGODBURL = process.env.MONGODB_URL;
 
 app.get("/api/health", (req, res) => {
    res.json({
      message: "Health",
      status: "Active",
      time: new Date(),
    });
  });

 app.get('/',(req,res)=>{
    res.json({message:"Express server running"})
 })

 app.listen(PORT, ()=>{
    try {
         mongoose.connect(MONGODBURL)
        console.log("express running")
        
    } catch (error) {
        console.log(error)
    }
 })