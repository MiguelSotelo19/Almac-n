import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { Login } from './screens/Login';
import { Storages } from './screens/Storages';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/Almacen/IniciarSesion' element={<Login />}/>
      <Route path='/Almacen/' element={<Storages />}/>
    </Routes>
  </Router>
)