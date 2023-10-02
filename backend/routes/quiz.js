var express = require("express");
var router  = express.Router();
const user = require('../models/user')
const quiz = require('../models/quiz')
const result = require('../models/result')
const quizResult = require('../models/quizResult')

const isTeacher = async (req, res, next) => {
    if (req.isAuthenticated()){
      if (req.user.occupation == 'teacher'){
        return next();
      } else{
        res.status(401).json({message: 'Only teachers can add quizzes!'})
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
}

router.get("/get/:quizid",async (req,res)=>{
    try{
      const result= await quiz.findById(req.params.quizid)
      res.status(200).json(result)
    }
    catch(err){
      console.log(err)
    }
})
  
router.post("/addQuiz", isTeacher, async (req,res)=>{
    try{
      const {quizName, subjectName, description,collegeName, questions,maxAttempts, deadline} = req.body;
      const newQuiz = new quiz({
        quizName,
        subjectName,
        description,
        setBy: req.user.email,
        collegeName,
        questions,
        maxAttempts,
        deadline,
        totalMarks: questions.length
      })
      await newQuiz.save()
      res.status(201).send("Quiz saved!!!");
    } catch (error) {
      console.error('Error saving quiz:', error.message);
      res.status(500).json({ message: 'An error occurred while saving the user.' });
    }
})
  
router.get("/quizzes/:college", async (req, res) => {
    try{
      const allQuizes = await quiz.find({collegeName:req.params.college}).sort({_id: -1})
      res.status(200).json(allQuizes)
    }catch(error){
      console.error('Error retreiving quizzes', error.message);
      res.status(500).json({ message: 'An error occurred while retreiving quizzes.' });
    }
})

router.get('/:quizName/getResults', async (req, res) => {
    try {
      const foundQuiz = await quiz.findOne({ subjectName: req.params.quizName });
  
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
  
router.post("/:quizName/store-result", async (req, res) => {
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
  
router.post('/:quesid/edit/',isTeacher, async (req,res)=>{
    const ques_id=req.params.quesid
    const {question,a,b,c,d,key,quiz_id}=req.body
    const foundQuiz = await quiz.findById(quiz_id)
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
      
router.post('/addques/',isTeacher, async (req,res)=>{
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
        res.status(200).json({ message: 'new ques is added into db!' });
      } else {
        res.status(500).json({ message: 'Please check again' });
      }
    } catch (error) {
      console.error('Error inserting new question:', error);
      res.status(500).json({ message: 'Please check again' });
    }
})
  
router.post('/:quesid/delete/',isTeacher, async (req,res)=>{
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
  
router.get("/delete/:quizid",async (req,res)=>{
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
  
module.exports = router;