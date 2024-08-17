const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const HttpError = require('../Models/HttpError')
const { validationResult } = require('express-validator')
 
exports.register = async(req,res,next)=>{ 
    const inputErr = validationResult(req)
    if(!inputErr.isEmpty()){
      return next(new HttpError('Invalid inputs passed, please check your data.',422))
    }

    try{
      //1. Check user, ตรวจสอบว่ามี user ที่ต้องการลงทะเบียนในฐานข้อมูลแล้วหรือยัง
      //console.log(req.body)
      const {name,password,role,email} = req.body //destructuring
      var user = await User.findOne({name})
      console.log(user)
      if(user){
         return res.send('User Already Exists!!!').status(400)
      }
       
      //2. Create new user and encrypt password. 
      user = new User({
        name,
        password,
        role,
        email
      })
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password,salt)
      console.log(user)

      //3. Save user to database.
      await user.save()
       
      res.send(req.body)

    }catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.login = async(req,res)=>{
    try{
        //1. ตรวจสอบ username, password ในฐานข้อมูล 
        //และใช้ฟังก์ชัน bcrypt.compare ตรวจสอบ password ที่ส่งมาจาก client กับค่าในฐานข้อมูล
        const {name,password} = req.body 
        var user = await User.findOneAndUpdate({name},{new:true})
        console.log(user)
        if(user)
        {
            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch){
                return res.status(400).send('Password is invalid!!')
            } 
          
            //2. เตรียมข้อมูล Payload เพื่อใช้สร้าง jwt 
            var payload = {
                user: {
                    name:user.name,
                    role:user.role
                }
            }
            
            //3. สร้าง jwt ด้วยฟังก์ชัน jwt.sign
            jwt.sign(payload,'jwtsecret',{ expiresIn:300 },(err,token)=>{
                if(err) throw err
                res.json({token,payload})
            })

        }else{
            return res.status(400).send('User not found!!!')
        } 
         
    }catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}