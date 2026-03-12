const express = require("express")

const app = express()

app.use(express.json())

let locationData = null

app.post("/location",(req,res)=>{

locationData = req.body

console.log(locationData)

res.send("Location received")

})

app.get("/location",(req,res)=>{

res.json(locationData)

})

app.listen(5000,()=>{
console.log("Server running on port 5000")
})