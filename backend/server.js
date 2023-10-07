const express=require('express')
const app=express()
const cors=require('cors')
const mongoose=require('mongoose')
const bodyParser=require("body-parser")
const passport = require("passport")
const passportConfig = require('./passport')
const ExpressError = require("./utils/ExpressError")

//requiring models
const user = require('./models/user')
const availableColleges=require('./models/availableColleges')

//requiring routes
const authRoutes = require("./routes/auth")
const quizRoutes = require("./routes/quiz")
const userRoutes = require("./routes/user")

mongoose.connect(
    "mongodb+srv://admin:admin143@cluster0.0ggnx.mongodb.net/MernStackQuizApp"
);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//Passport configuration
app.use(require("express-session")({
	secret :"This project is created using MERN Stack",
	resave :false,
	saveUninitialized :false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

//using routes
app.use("/", authRoutes)
app.use("/", quizRoutes)
app.use("/", userRoutes)

app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.get("/sarada",async (req,res)=>{
  const temp = await user.findOneAndDelete({"email":"codebean0308@gmail.com"})
  return res.json(temp)
})

app.get("/get_all_colleges", async (req,res)=>{
  try{
  const colleges= await availableColleges.find();

  res.json(colleges[0].college)}
  catch(err){
    console.log(err)
  }
})

app.post('/add_College', async (req, res) => {
  try {
    const { college } = req.body; // Assuming the request body contains a single college name

    if (!college) {
      return res.status(400).json({ error: 'College name is required.' });
    }

    // Find the existing document in the database
    const existingCollegeDocument = await availableColleges.findOne();

    if (!existingCollegeDocument) {
      // If no document exists, create a new one with the single college
      const newCollegeDocument = new availableColleges({ college: [college] });
      const savedCollegeDocument = await newCollegeDocument.save();
      return res.status(201).json(savedCollegeDocument);
    }

    // Append the new college to the existing list
    existingCollegeDocument.college.push(college);
    const updatedCollegeDocument = await existingCollegeDocument.save();

    res.status(200).json(updatedCollegeDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.all('*',(req,res,next)=>{
	next(new ExpressError('Page not Found!!',404))
})

app.use(function(err, req, res, next) {
	if(!err.message){
		err.message = "Something went wrong!"
	}
	if(!err.statusCode){
		err.statusCode = 500
	}
	const {statusCode, message} = err
	res.status(statusCode).json(message)
});

// mongoose.connect()
app.listen(5000,(req,res)=>{
  console.log("Server started at http://localhost:5000/")
})