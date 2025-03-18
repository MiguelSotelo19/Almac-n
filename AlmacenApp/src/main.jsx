import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { Login } from './screens/Login';
import { Home } from './screens/Home';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/Almacen/' element={<Login />}/>
      <Route path='/Almacen/Inicio' element={<Home />}/>
    </Routes>
  </Router>
)