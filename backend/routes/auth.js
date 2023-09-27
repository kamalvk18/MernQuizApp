var express = require("express");
var router  = express.Router();
var passport = require("passport")
const user = require('../models/user')

const setCookies = (req, res) => {
    res.cookie('email', req.user.email, { secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.cookie('name', req.user.name, { secure: true, maxAge: 24 * 60 * 60 * 1000 });
}

//google auth
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/'}), 
  function(req, res) {
    // Successful authentication, redirect home.
    setCookies(req, res);
    if (!req.user.college){
      res.redirect('http://localhost:3000/register')
    } else {
      res.redirect('http://localhost:3000/main');
    }
  });

//local auth
router.post("/signup",async (req,res)=>{
    try{
      const { name, email, password, college,phone,occupation } = req.body;
      const userdata= new user({
          name,
          email,
          password,
          phone,
          college,
          occupation
      })
      const registeredUser = await user.register(userdata, req.body.password)
      req.login(registeredUser, err => {
        if(err) return next(err);
        setCookies(req, res);
        res.status(200).json({ message: 'User Registered' });
      })
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'An error occurred while registering the user.' });
  }
})

router.post("/login", (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // Pass the error to the next middleware
    }

    if (!user) {
      // Authentication failed
      return res.status(401).json({ error: 'Invalid credentials' }); // Send an error response
    }

    // Authentication succeeded, proceed with your logic
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      setCookies(req, res);
      return res.status(200).json({ message: 'User logged in!' });
    });
  })(req, res, next);
});

//logout
router.get('/logout', async (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Error logging out:', err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.clearCookie('email');
        res.clearCookie('name');
        res.status(200).json({ message: 'Logged out successfully' });
      }
    });
})

module.exports = router;