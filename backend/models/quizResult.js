const mongoose = require('mongoose')

const quizResultSchema = new mongoose.Schema({
    quizName:{
      type: String,
      required: true
    },

    studentResults: [{
      type:mongoose.Schema.Types.ObjectId,
      ref:"result"
    }]
  })

module.exports = mongoose.model("quizResult", quizResultSchema)