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

})

const optionSchema = new mongoose.Schema({
  option: {
    type: String,
    required: true
  },

  isAnswer: {
    type: Boolean,
    default: false
  }
})

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  timeInSec:{
    type:Number,
    default:30
  },
  options: [
    optionSchema
  ],
})

const quizschema=new mongoose.Schema({
    subjectName: {
      type: String,
      required: true
    },

    description: String,
    collegeName:{
      type:String,
      required:true
    },
    questions: [
      questionSchema
    ]

})

const quiz = mongoose.model("quiz", quizschema)
const user = mongoose.model("user", Userschema)

app.use(cors())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.post('/check-user', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Checking {email}', email)
    // Check if the user exists
    const userData = await user.findOne({ email });
    // Send the response indicating whether the user exists or not
    res.json({ exists: !!userData });
  } catch (error) {
    // Handle any errors that occurred during the query
    res.status(500).json({ error: 'Error checking user' });
  }
}) 

app.get("/addQuiz",(req,res)=>{
  res.send("Add Quiz form")
})

app.post("/addQuiz",async (req,res)=>{
  try{
    const {subjectName, description,collegeName, questions} = req.body;
    const newQuiz = new quiz({
      subjectName,
      description,
      collegeName,
      questions
    })
    await newQuiz.save()
    res.status(201).send("Quiz saved!!!");
  } catch (error) {
    console.error('Error saving quiz:', error.message);
    res.status(500).json({ message: 'An error occurred while saving the user.' });
  }
})

app.get("/quizzes/:college", async (req, res) => {
  try{
    const allQuizes = await quiz.find({collegeName:req.params.college})
    res.status(200).json(allQuizes)
  }catch(error){
    console.error('Error retreiving quizzes', error.message);
    res.status(500).json({ message: 'An error occurred while retreiving quizzes.' });
  }
})
app.get("/userdata/:email", async (req, res) => {
  try{
    const usersdata = await user.find({email:req.params.email})
    return res.json(usersdata)
    // return res.json(usersdata)
  }catch(error){
    console.error('Error retreiving users', error.message);
    res.status(500).json({ message: 'An error occurred while retreiving users.' });
  }
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
   console.log("Server started at http://localhost:5000/")
})