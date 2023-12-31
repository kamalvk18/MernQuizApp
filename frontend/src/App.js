import './App.css';

import LandingPage from './components/LandingPage';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import AddQuiz from './components/AddQuiz';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import PrivateRoute from './components/PrivateRoute';
import EditQuiz from './components/EditQuiz';
import DisplayQuiz from './components/DisplayQuiz';
import Settings from './components/Settings';
import Addques from './components/Addques';
import Editques from './components/Editques'
import Error from './components/Error';
import DisplayQues from './components/DisplayQues'


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
      <Route path="/addquiz" element={<PrivateRoute Component={AddQuiz} />} />
      <Route path="/addques" element={<PrivateRoute Component={Addques} />} />
      <Route path="/editques" element={<PrivateRoute Component={Editques} />} />
      <Route exact path='/exam' element={< DisplayQues/>} />
      <Route exact path='/editquiz' element={<PrivateRoute Component={EditQuiz} />} />
      <Route exact path='/quiz' element={< DisplayQuiz/>} />
      <Route exact path='/settings' element={< Settings/>} />
      <Route exact path='/error' element={< Error/>} />
      </Routes>
      </Router>

    </div>
  );
}

export default App;
