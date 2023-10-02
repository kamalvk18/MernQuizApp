const mongoose = require('mongoose');


const availableColleges = new mongoose.Schema({
    college: [
        {
          type: String,
        }
      ],
});

const College = mongoose.model('availableColleges', availableColleges);

module.exports = College;
