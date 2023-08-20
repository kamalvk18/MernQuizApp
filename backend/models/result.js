const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
    quizName:{
      type: String,
      required: true
    },
  
    studentEmail: {
      type: String,
      require: true
    },
  
    marksObtained: {
      type: Number,
      required: true
    },
  
    attempt:{
      type: Number,
      default: 1
    },
    date: {
      type: Date,
      default: Date.now // Set default value to the current date and time
    }
  })

module.exports = mongoose.model("result",resultSchema)