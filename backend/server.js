const express=require('express')
const app=express()
const cors=require('cors')
const mongoose=require('mongoose')
const bodyParser=require("body-parser")
passport = require("passport"),
passportCustom = require('passport-custom');
const CustomStrategy = passportCustom.Strategy;

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
    
    // password:{
    //     type:String,
    //     required:true
    // },
    
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

//Passport configuration
app.use(require("express-session")({
	secret :"This project is created using MERN Stack",
	resave :false,
	saveUninitialized :false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new CustomStrategy(
  async function(req, done) {
    try {
      const foundUser = await user.findOne({ email: req.body.email });
      if (foundUser) {
        done(null, foundUser);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err);
    }
  }
));

// Serialize the user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize the user
passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await user.findById(id);
    if (foundUser) {
      done(null, foundUser);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
});

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    // Redirect the user to the login page or send an error response
    res.status(401).json({ message: 'Unauthorized' });
  }
};

const isTeacher = async (req, res, next) => {
  if (req.isAuthenticated()){
    if (req.user.occupation == 'teacher'){
      return next();
    } else{
      res.status(401).json({message: 'Only teachers can add quizzes!'})
    }
  } else {
    // Redirect the user to the login page or send an error response
    res.status(401).json({ message: 'Unauthorized' });
  }
}

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()){
    return res.status(200).send('Authenticated user!')
  }else{
    return res.status(401).send('Unauthorized user!')
  }
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

app.post("/addQuiz", isTeacher, async (req,res)=>{
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
// app.get("/quizzes/fetch/:college/:quizid", async (req, res) => {
//   try{
//     const allQuizes = await quiz.find({collegeName:req.params.college})
//     res.status(200).json(allQuizes+" "+req.params.quizid)
//   }catch(error){
//     console.error('Error retreiving quizzes', error.message);
//     res.status(500).json({ message: 'An error occurred while retreiving quizzes.' });
//   }
// })
app.get("/userdata/:email", async (req, res) => {
  try{
    const usersdata = await user.find({email:req.params.email})
    return res.json(usersdata)
  }catch(error){
    console.error('Error retreiving users', error.message);
    res.status(500).json({ message: 'An error occurred while retreiving users.' });
  }
})

app.post("/signup",async (req,res)=>{
    try{
      const { name, email, college,phone,occupation } = req.body;
      const data= new user({
          name,
          email,
          phone,
          college,
          occupation
      })
      await data.save()
      passport.authenticate("custom", { failureRedirect: "/login" })(req, res, () => {
        // You can perform additional actions or send a response here if needed
        res.status(200).json({ data });
      });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'An error occurred while registering the user.' });
  }
})

app.post("/login",passport.authenticate('custom', { failureRedirect: '/login' }), async (req,res)=>{
  try{
      const { email } = req.body;
      res.status(200).json({  message: 'User logged in!'  });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
})

app.get('/logout', isAuthenticated, async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(200).json({ message: 'Logged out successfully' });
    }
  });
})

// mongoose.connect()
app.listen(5000,(req,res)=>{
   console.log("Server started at http://localhost:5000/")
})