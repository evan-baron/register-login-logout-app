import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import '../style.scss';

// Pages
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';

const App = () => {
  return (
    <div className="app">
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App