import './App.css';

import LandingPage from './components/LandingPage';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import Quiz from './components/Quiz';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Writequiz from './components/Writequiz';
import PrivateRoute from './components/PrivateRoute';
import EditQuiz from './components/EditQuiz';
import DisplayQuiz from './components/DisplayQuiz';

function App() {

  return (
    // first we will focus only on connecting frontend with backend once everything works then we will design a proper ui.
    // first we will add landing page which will be redirected to login and register page then after successful auth we will redirect to home page.
    <div className="App">
      <Router>
      <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route exact path='/register' element={<RegistrationForm/>} />
      <Route exact path='/login' element={< LoginForm/>} />
      <Route path="/main" element={<PrivateRoute Component={HomePage} />} />
      <Route path="/addquiz" element={<PrivateRoute Component={Quiz} />} />
      <Route exact path='/exam' element={< Writequiz/>} />
      <Route exact path='/editquiz' element={< EditQuiz/>} />
      <Route exact path='/quiz' element={< DisplayQuiz/>} />
      </Routes>
      </Router>

    </div>
  );
}

export default App;
