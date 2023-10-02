var mongoose = require("mongoose")

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
  quizName:{
    type:String,
    required: true
  },

  subjectName: {
    type: String,
    required: true
  },

  description: String,

  setBy:{
    type: String,
    required: true
  },

  collegeName:{
    type:String,
    required:true
  },

  questions: [
    questionSchema
  ],

  maxAttempts: Number,

  totalMarks: Number,

  deadline: Date
})

module.exports = mongoose.model("quiz",quizschema)