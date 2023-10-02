var express = require("express");
var router  = express.Router();
const user = require('../models/user')

router.get("/userdata/:email", async (req, res) => {
    try{
      const usersdata = await user.find({email:req.params.email})
      return res.json(usersdata)
    }catch(error){
      console.error('Error retreiving users', error.message);
      res.status(500).json({ message: 'An error occurred while retreiving users.' });
    }
})

router.post("/settings/:email", async (req, res) => {
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

module.exports = router;