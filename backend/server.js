const express=require('express')
const app=express()
const cors=require('cors')
const mongoose=require('mongoose')
const bodyParser=require("body-parser")
passport = require("passport"),
passportCustom = require('passport-custom');
const CustomStrategy = passportCustom.Strategy;

//requiring models
const result = require('./models/result')
const quiz = require('./models/quiz')
const quizResult = require('./models/quizResult')
const user = require('./models/user')
const { ObjectId } = mongoose.Types;

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
  console.log("Checking Authentication...")
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

app.get("/testing",async (req,res)=>{
  const temp = await user.find({email:'codebean0308@gmail.com'})
  return res.json(temp)
})
app.get("/get/:quizid",async (req,res)=>{
  try{
    const result= await quiz.findById(req.params.quizid)
    res.status(200).json(result)
    // console.log(res)
  }
  catch(err){
    console.log(err)
  }
})

app.post("/addQuiz", isTeacher, async (req,res)=>{
  try{
    const {quizName, subjectName, description,collegeName, questions} = req.body;
    const newQuiz = new quiz({
      quizName,
      subjectName,
      description,
      setBy: req.user.email,
      collegeName,
      questions,
      totalMarks: questions.length
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

app.get('/:quizName/get-results', isAuthenticated, async (req, res) => {
  try{
    // const foundUser = await user.findById(req.user._id);
    // await foundUser.populate('quizzesAttempted');
    // const result = foundUser.quizzesAttempted.filter((result) => result.quizName === req.params.quizName);
    
    const foundQuiz = await quiz.findOne({subjectName: req.params.quizName})
    // console.log(req.params.quizName,foundQuiz)
    // result.totalMarks=foundQuiz.totalMarks
    // if (foundQuiz){
    //   // const foundQuizResult = await quizResult.findOne({quizName})
    //   console.log(foundQuiz)
    // }
    res.status(200).json(foundQuiz.totalMarks)
    
  }catch(err){
    console.log(err)
    // return res.status(404).json(err)
  }
})

app.get("/get-all-quizzes", isAuthenticated, async (req, res) => {
  try{
    const foundUser = await user.findById(req.user._id);
    await foundUser.populate('quizzesAttempted');
    const allQuizzes = foundUser.quizzesAttempted
    console.log("is it gng")
    return res.status(200).json({allQuizzes})
  }catch(err){
    console.log("fuck off")
    return res.status(400).json(err)
  }
})

app.post("/:quizName/store-result", isAuthenticated, async (req, res) => {
  try{
    const marksObtained = req.body.score
    const {quizName} = req.params
    const foundQuiz = await quiz.findOne({subjectName: quizName})
    if (foundQuiz){
      const foundQuizResult = await quizResult.findOne({quizName})
      const studentResult = new result({
        quizName,
        studentEmail: req.user.email,
        marksObtained
      })
      console.log('quiz result Found', foundQuizResult)
      await studentResult.save()
      if (foundQuizResult){
        foundQuizResult.studentResults.push(studentResult)
        await foundQuizResult.save()
      }else{
        const newQuizResult = new quizResult({
          quizName,
          studentResults: [studentResult]
        })
        await newQuizResult.save()
      }
      const foundUser = await user.findOne({email: req.user.email})
      await foundUser.populate('quizzesAttempted')
      var maxAttempt = 0;
      foundUser.quizzesAttempted.map((result) => {
        if (result.quizName === req.params.quizName){
          maxAttempt = Math.max(maxAttempt, result.attempt)
        }
      })
      studentResult.attempt = maxAttempt + 1
      await studentResult.save()
      foundUser.quizzesAttempted.push(studentResult)
      await foundUser.save()
      return res.status(200).send("Result saved successfully")
    }
  } catch(error) {
    return res.send(400, error.message);
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
      await passport.authenticate("custom", { failureRedirect: "/login" })(req, res, async () => {
        // After successful authentication, manually log in the user
        req.login(data, (err) => {
          if (err) return next(err);
          res.status(200).json({ message: 'User Registered' });
        });
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
// app.get('/edit/:quesid',async (req,res)=>{
//   const ques_id=req.params.quesid
//   try{
//     const foundQuiz = await quiz.findOne({subjectName: "fewefwe"})
//     if (foundQuiz){
//       // const foundQuizResult = await quizResult.findOne({quizName})
//       foundQuiz.questions.map((q,id)=>{
//         if(q._id.equals(ques_id)){
//           console.log("got it boss",q)
//           q.question="can i write this"
//         }
//       })
//       await foundQuiz.save()
//     }
//   }
//   catch(err){
//     console.log(err)
//   }
// })
// String.prototype.toObjectId = function() {
//   var ObjectId = (mongoose.Types.ObjectId);
//   return new ObjectId(this.toString());
// };
app.post('/edit/:quesid',async (req,res)=>{
  const ques_id=req.params.quesid
  const {question,a,b,c,d,key,quiz_id}=req.body
  const new_options = [
    { option: a, isAnswer: key==="1" },
    { option: b, isAnswer: key==="2" },
    { option: c, isAnswer: key==="3" },
    { option: d, isAnswer: key==="4" },
  ];
  
  // console.log(options,question,ques_id.toObjectId(),mongoose.Types.ObjectId.createFromHexString(ques_id))
  try {
    // console.log(ques_id,quiz_id)
    if(ques_id!=="undefined"){
console.log("gud la petuko")
    const result = await quiz.updateOne(
      { 'questions._id': mongoose.Types.ObjectId.createFromHexString(ques_id) }, // Query to match documents that have the 'options' field in the 'questions' array
      {
        $set: {
          'questions.$.question': question, // Update the 'question' field in all elements of the 'questions' array
          'questions.$.options': new_options, // Update the 'options' field in all elements of the 'questions' array
        },
      },
      { new: true }
    );

    if (result){
      console.log(result)
      res.status(200).json({ message: 'super values are inserted!' });
    }
  }

  else{
    //that means that question is not there in our db and we need to push a new value 
    console.log("here it is",quiz_id,ques_id,"nulls")
    try {
      const newQuestion=[

        {
          
          question:question,
        options:new_options}
      ]
      // Find the quiz by its _id (quizId) and push the new question into the questions array
      const updatedQuiz = await quiz.findOneAndUpdate(
        { _id: quiz_id },
        { $push: { questions: newQuestion },
        $inc: { totalMarks: 1 } },
        { new: true }
      );
      if (updatedQuiz) {
        console.log('New question inserted into the quiz:', updatedQuiz);
        res.status(200).json({ message: 'new ques is added into db!' });
      } else {
        console.log('Quiz not found or question not inserted.');
        res.status(500).json({ message: 'Please check again' });
      }
    } catch (error) {
      console.error('Error inserting new question:', error);
      res.status(500).json({ message: 'Please check again' });
    }
  }
}
  catch(err){
    console.log(err)
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