import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import { Login } from '../screens/Login';
import { Storages } from '../screens/Storages';
import { Register } from '../screens/Register';
import { Users } from '../screens/Users';
import { StorageUser } from '../screens/StorageUser';
import { Bitacora } from '../screens/Bitacora';
import { E404 } from '../screens/E404';
import { E401 } from '../screens/E401';
import { E403 } from '../screens/E403';

const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
};

const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/403" replace />;
};

const RedirectIfAuthenticated = ({ element }) => {
    return isAuthenticated() ? <Navigate to="/Almacen/Almacenes" replace /> : element;
};

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RedirectIfAuthenticated element={<Login />} />} />
                <Route path="/Almacen/" element={<RedirectIfAuthenticated element={<Login />} />} />
                <Route path="/Almacen/registro" element={<RedirectIfAuthenticated element={<Register />} />} />

                <Route path="/Almacen/Almacenes" element={<ProtectedRoute element={<Storages />} />} />
                <Route path="/Almacen/Usuarios" element={<ProtectedRoute element={<Users />} />} />
                <Route path="/Almacen/Responsable" element={<ProtectedRoute element={<StorageUser />} />} />
                <Route path="/Almacen/Bitacora" element={<ProtectedRoute element={<Bitacora />} />} />

                <Route path="/401" element={<E401 />} />
                <Route path="/403" element={<E403 />} />
                <Route path="*" element={<E404 />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
