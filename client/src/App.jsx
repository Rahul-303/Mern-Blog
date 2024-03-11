import React from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<Home/>}/>
      <Route path='/about' element = {<About/>}/>
      <Route path='/dashboard' element = {<Dashboard/>}/>
      <Route path='/sign-in' element = {<SignIn/>}/>
      <Route path='/sign-up' element = {<SignUp/>}/>
      <Route path='/projets' element = {<Projects/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App