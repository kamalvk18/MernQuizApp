const express=require('express')
const app=express()
const cors=require('cors')
const mongoose=require('mongoose')
const bodyParser=require("body-parser")
const passport = require("passport")
const passportConfig = require('./passport')

//requiring models
const result = require('./models/result')
const quiz = require('./models/quiz')
const quizResult = require('./models/quizResult')
const user = require('./models/user')

//requiring routes
const authRoutes = require("./routes/auth")

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
app.use("/",authRoutes)

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

app.get("/sarada",async (req,res)=>{
  const temp = await user.findOneAndDelete({"email":"codebean0308@gmail.com"})
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

app.get("/userdata/:email", async (req, res) => {
  try{
    const usersdata = await user.find({email:req.params.email})
    return res.json(usersdata)
  }catch(error){
    console.error('Error retreiving users', error.message);
    res.status(500).json({ message: 'An error occurred while retreiving users.' });
  }
})

app.get('/:quizName/getTotalMarks', isAuthenticated, async (req, res) => {
  try{
   
    const foundQuiz = await quiz.findOne({subjectName: req.params.quizName})
    res.status(200).json(foundQuiz.totalMarks)
    
  }catch(err){
    console.log(err)
   
  }
})
app.get('/:quizName/getResults', async (req, res) => {
  try {
    const foundQuiz = await quiz.findOne({ subjectName: req.params.quizName });
    // console.log(req.params.quizName, foundQuiz);

    if (foundQuiz) {
      const quizName = req.params.quizName; 

      const foundQuizResult = await quizResult.findOne({ quizName })
        .populate({
          path: 'studentResults',
          select: 'studentEmail marksObtained attempt date',
          options: {
            sort: { marksObtained: -1 }, // Sort by marks in descending order
            // group: 'studentEmail', // Group by studentEmail
            // limit: 1 // Limit to 1 document per group (highest score)
    } })
    console.log(foundQuizResult)
      if (foundQuizResult) {
        res.status(200).json(foundQuizResult);
      } else {
        res.status(404).json({ error: 'No quiz results found' });
      }
    } else {
      res.status(404).json({ error: 'Quiz not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get("/get-all-quizzes", isAuthenticated, async (req, res) => {
  try{
    const foundUser = await user.findById(req.user._id);
    await foundUser.populate('quizzesAttempted');
    const allQuizzes = foundUser.quizzesAttempted
    return res.status(200).json({allQuizzes})
  }catch(err){
    return res.status(400).json(err)
  }
})

app.post("/:quizName/store-result", isAuthenticated, async (req, res) => {
  try{
    const marksObtained = req.body.score
    const {quizName} = req.params
    const email=req.user.email
    const foundQuiz = await quiz.findOne({subjectName: quizName})
    if (foundQuiz){
      const foundQuizResult = await quizResult.findOne({quizName})
      const studentResult = new result({
        quizName,
        studentEmail: email,
        marksObtained,
      }) 

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
      const foundUser = await user.findOne({email})
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

app.post('/:quesid/edit/',isTeacher, async (req,res)=>{
  const ques_id=req.params.quesid
  const {question,a,b,c,d,key,quiz_id}=req.body
  const foundQuiz = await quiz.findById(quiz_id)
  console.log(foundQuiz)
  if (foundQuiz && foundQuiz.setBy === req.user.email){
    const new_options = [
      { option: a, isAnswer: key==="1" },
      { option: b, isAnswer: key==="2" },
      { option: c, isAnswer: key==="3" },
      { option: d, isAnswer: key==="4" },
    ];
    
    try {
      if(ques_id!=="undefined"){
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
    } catch(err){
      console.log(err)
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(400).json({message: 'You are not the one who created this quiz!'})
  }
})
    
app.post('/addques/',isTeacher, async (req,res)=>{
  const {question,a,b,c,d,key,quiz_id}=req.body
  const new_options = [
    { option: a, isAnswer: key==="1" },
    { option: b, isAnswer: key==="2" },
    { option: c, isAnswer: key==="3" },
    { option: d, isAnswer: key==="4" },
  ];
  try {
    const newQuestion=[{ 
      question:question,
      options:new_options
    }]
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
})

app.post('/:quesid/delete/',isTeacher, async (req,res)=>{
  const questionId=req.params.quesid
  const {quiz_id}=req.body
  const foundQuiz = await quiz.findById(quiz_id)
  if (foundQuiz && foundQuiz.setBy === req.user.email && questionId){
    questionObj = new mongoose.Types.ObjectId(questionId)
    const questionIndex = foundQuiz.questions.findIndex(question => question._id.equals(questionObj));

    if (questionIndex === -1) {
      console.error(`No question found with ID ${questionId} in quiz ${quiz_id}`);
      return;
    }
  
    // Remove the question from the questions array
    foundQuiz.questions.splice(questionIndex, 1);
    // Save the updated quiz
    try {
      await foundQuiz.save();
      return res.json(foundQuiz.questions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while saving the quiz.' });
    }
  }
})

app.get("/delete/:quizid",async (req,res)=>{
  let quiz_id=req.params.quizid
  try{
 const result=await quiz.deleteOne({_id:quiz_id})
  const remaining=await quiz.find({})
  res.status(200).json({message:"deleted",remaining})
  }
  catch(err){
    res.status(500).json({ message: 'Please check again' });
  }
})
app.post("/settings/:email", async (req, res) => {
  try {
    // Validate input data (ensure it meets your requirements)
    const { username, pass, phone } = req.body;
    if (!username || !pass || !phone) {
      return res.status(400).json({ message: 'Missing required data.' });
    }

    // Update the user document in the database
    const email = req.params.email;
    const updatedUser = await user.findOneAndUpdate(
      { email },
      { name: username, password: pass, phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Send a success response
    return res.status(200).json({ message: 'User information updated successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});



// mongoose.connect()
app.listen(5000,(req,res)=>{
   console.log("Server started at http://localhost:5000/")
})