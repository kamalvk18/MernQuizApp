const express=require('express')
const app=express()
const cors=require('cors')
const mongoose=require('mongoose')
const bodyParser=require("body-parser")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
mongoose.connect(
    "mongodb+srv://admin:admin143@cluster0.0ggnx.mongodb.net/MernStackQuizApp"
);
const Userschema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
            required:true
    },
    phone:Number,
    college:{   
            type:String,
            required:true
    },
    occupation:{
        type:String,
            required:true
    }


   //i will complete this
})
const quizschema=new mongoose.Schema({
    //u complete
})
app.use(cors())
const user=mongoose.model("user",Userschema)
app.get("/",(req,res)=>{
    res.send("hello world")
})
app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
app.post("/addquiz",async (req,res)=>{
    //u compelete
})
app.get("/quiz",(req,res)=>{
    //u complete
})
app.post("/signup",async (req,res)=>{
    try{
        const { name, email, password,college,phone,occupation } = req.body;

    const existingUser = await user.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
          const data= new user({
        name,
        email,
        password:hashedPassword,
        phone,
        college,
        occupation
    })
    await data.save()
    const token = jwt.sign({ userId: user._id }, 'secret-key');
  
    res.status(201).json({ data,token });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'An error occurred while registering the user.' });
  }
})
app.post("/login", async (req,res)=>{


    const { email, password } = req.body;
    console.log(email,password)
try{
    // Check if user exists
    const User = await user.findOne({ email });
    if (!User) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    console.log(password,User.password)
    const isPasswordValid = await bcrypt.compare(password, User.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JSON web token (JWT)
    const token = jwt.sign({ userId: user._id }, 'secret-key');

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
// app.get("/login",verifyToken,(req,res)=>{
//     res.status(200).json({ message: 'Protected route' });
//     // console.log(req.body)
// //    ill complete
// })

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, 'secret-key', (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      req.userId = decoded.userId;
      next();
    });
  }
// mongoose.connect()
app.listen(5000,(req,res)=>{
   console.log("running!")
})