const {isValid}=require('../validators/validation')
const jwt= require('jsonwebtoken')
const sql = require('../db')
const validator = require('validator')

const create= async function(req,res){
    try{
        const data=req.body
        console.log(data)
        

        if(!isValid(data.name)) return res.status(400).send({status:false,message:"name is mandatory"})
        if (!(data.name).match(/^[a-zA-Z_ ]+$/)) return res.status(400).send({ status: false, message: "give valid name" });
        
        
        //-------------email validations------------------------------
        if(!isValid(data.email)) return res.status(400).send({status:false,message:"email is mandatory"})
        if (!validator.isEmail(data.email)) return res.status(400).send({ status: false, message: "please enter valid email address!" })
        
        //-------------email uniqueness------------------------------
        let que = "SELECT * FROM users WHERE email='"+data.email+"'"
        const user=await sql(que)
        if(user.length>0) return res.status(401).send({status:false, message:"email already exist"})
        
    
        // if (!isValid(data.phone)) return res.status(400).send({ status: false, message: "phone is mandatory" });
        // if (!(data.phone.match(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/))) return res.status(400).send({ status: false, message: "phone number is not valid" })
        // if(data.phone.length==10) data.phone='91'+data.phone
    
        if(!isValid(data.password)) return res.status(400).send({status:false,message:"password is mandatory"})
        if(data.password.length<5 || data.password.length>10) return res.status(400).send({status:false,message:"password length should be in range 5-10"})
        
        if(!data.type)return res.status(400).send({status:false,message:"user type is required"})
        if(!['Admin',"User"].includes(data.type))return res.status(400).send({status:false,message:"type only be Admin or User"})


    
    
    
        
        
        let query="INSERT INTO users VALUES ?"
        var values=[[,data.name,data.email,data.password,data.type]]
        let data1 =await sql(query,[values])
        
        res.status(201).send({status:true,data:data1})

    }
    catch(err){
        res.status(500).send({status:false,message:err})
    }
}

const login =async function(req,res){
    try{
        const data =req.body
        const email =data.email
        const password=data.password
        let query = "SELECT * FROM users WHERE email='"+email+"' AND password='"+password+"'"
        
        const user=await sql(query)
        console.log(user)
    
        if(user.length==0) return res.status(401).send({status:false, message:"user credential wrong"})
       
    
        let token = jwt.sign({ userId: user[0].id , type:user[0].type}, "Secret-key")
        
        res.status(200).send({status:true,message:"you are authorised",userId:user[0].id,token:token})
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})

    }
}

const event = async function(req,res){
    let data = req.body
    if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"body data is required"})
    if(!data.name)return res.status(400).send({status:false,message:"name is required"})
    if(!data.available_tickets )return res.status(400).send({status:false,message:"available_tickets  is required"})
    if(!data.ticket_price  )return res.status(400).send({status:false,message:"ticket_price   is required"})
    if(!data.ending_date  )return res.status(400).send({status:false,message:"ending_date   is required"})

    if(req.decode.type!="Admin")return res.status(403).send({status:false,message:"your are authorised to create an event"})
    let query="INSERT INTO events VALUES ?"
    var values=[[,data.name,data.available_tickets,data.ticket_price,data.ending_date]]
    let data1 =await sql(query,[values])
    res.status(201).send({status:true,data:data1})

}

const getEvents =async function(req,res){
    let queries = req.query
    if(queries.price){
        let query="SELECT * FROM events WHERE ticket_price < "+queries.price+""
        let data1 =await sql(query)
        return res.status(200).send({status:true,data:data1})


    }
    let query="SELECT * FROM events"
    let data1 =await sql(query)
    return res.status(200).send({status:true,data:data1})
}


const bookTicket = async function(req,res){
    let eventId= req.parmans.id
    let tickets = req.body.tickets
    let q1 = "SELECT * FROM events WHERE id ='"+eventId+"'"
    let event =await sql(q1)
    if(!event)return res.status(404).send({status:false,message:"no any event found with this id"})
    let endDate= event[0].ending_date
    endDate = new Date(endDate);
    endDate = endDate.getTime();
    if(endDate<Date.now())return res.status(400).send({status:false,message:"time is over, now you can book ticket"})

    if(tickets<=0)return res.status(400).send({status:false,message:"Atleast 1 ticket you can buy"})

    if(tickets>event.available_tickets)return res.status(400).send({status:false,message:"this much tickets not availabel"})
    let query= "UPDATE events SET available_tickets = available_tickets - '"+tickets+"' WHERE id = '"+eventId+"'"
    let bookticket= await sql(query)
    return res.status(200).send({status:false,message:"you successfully booked your tickets"})
}





module.exports.create=create
module.exports.login=login
module.exports.event=event
module.exports.getEvents=getEvents
module.exports.bookTicket=bookTicket