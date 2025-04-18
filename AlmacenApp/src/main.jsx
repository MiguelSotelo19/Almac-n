import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { Login } from './screens/Login';
import { Storages } from './screens/Storages';
import { Register } from './screens/Register'; 
import { Users } from './screens/Users';
import { StorageUser } from './screens/StorageUser';
import { Bitacora } from './screens/Bitacora';
import { E404 } from './screens/E404';
import { E401 } from './screens/E401';
import { E403 } from './screens/E403';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/Almacen/' element={<Login />}/>
      <Route path='/Almacen/registro' element={<Register />} />
      <Route path='/Almacen/Responsable' element={<StorageUser />}/>
      <Route path='/Almacen/Almacenes' element={<Storages />}/>
      <Route path='/ALmacen/Usuarios' element={<Users />}/>
      <Route path='/Almacen/Bitacora' element={<Bitacora />}/>
      <Route path='*' element={<E404 />}/>
      <Route path="/401" element={<E401 />} />
      <Route path="/403" element={<E403 />} />
    </Routes>
  </Router>
)