const express=require('express')

const app=express()

app.use('/',(req,res)=>
{
   res.send("Hello")
    
})

app.listen(5000,()=>
{
    console.log("App is running on 5000")
})