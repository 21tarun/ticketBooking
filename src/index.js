const express =require('express')
const app =express()
const route =require('./routes/route')


app.use(express.json())
app.use(express.urlencoded());







app.use('/',route)

app.listen(4000 , function(){
    console.log("server running on port "+4000)
})












