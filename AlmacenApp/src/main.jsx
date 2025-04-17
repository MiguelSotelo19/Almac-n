import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { Login } from './screens/Login';
import { Storages } from './screens/Storages';
import { Register } from './screens/Register'; 
import { Users } from './screens/Users';
import { StorageUser } from './screens/StorageUser';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/Almacen/' element={<Login />}/>
      <Route path='/Almacen/registro' element={<Register />} />
      <Route path='/Almacen/Responsable' element={<StorageUser />}/>
      <Route path='/Almacen/Almacenes' element={<Storages />}/>
      <Route path='/ALmacen/Usuarios' element={<Users />}/>
    </Routes>
  </Router>
)