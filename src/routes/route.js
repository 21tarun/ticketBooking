const express =require('express')
const router = express.Router()
const controller =require('../controllers/controller')
const midd = require('../middlewares/auth')

router.get('/',function(req,res){
    res.status(200).send({status:true,message:"api created successfully"})
})

router.post('/create',controller.create)
router.post('/login',controller.login)

router.post('/event',midd.Authentication,controller.event)

router.get('/getEvents',midd.Authentication,controller.getEvents)

router.post('/bookTicket/:id',midd.Authentication,controller.bookTicket)






module.exports=router
