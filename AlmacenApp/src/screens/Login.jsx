import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

import banner from "../assets/banner.jpeg";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import Swal from 'sweetalert2';
import { useEffect } from "react";


export const Login = () => {
    const urlLogin = 'http://127.0.0.1:8080/api/auth/login';

    const navigate = useNavigate();
    const [nombre_usuario, setNombreUsuario] = useState("");
    const [password, setPassword] = useState("");

    const isAuthenticated = () => {
        return !!localStorage.getItem("token"); 
    };
    

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/Almacen/Inicio", { replace: true });
        }
    }, []);

    const handleLogin = async () => {
        if (!nombre_usuario || !password) {
            Swal.fire({
                icon: "warning",
                title: "Campos vacíos",
                text: "Por favor, ingresa tu usuario y contraseña.",
            });
            return;
        }
    
        try {
            const response = await axios.post(urlLogin, {
                "username": nombre_usuario,
                "password": password,
            }, {
                withCredentials: true
            });
    
            if (response.status === 200) {
                localStorage.setItem("token", response.data.data);
    
                Swal.fire({
                    icon: "success",
                    title: "Inicio de sesión exitoso",
                    text: "Bienvenido a Almacén 👻",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    navigate("/Almacen/Inicio");
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error en el inicio de sesión",
                text: "Usuario o contraseña incorrectos.",
            });
        }
    };
    
    return (
        <div className="d-flex vh-100">
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="card p-4 w-50 d-flex flex-column">
                    <div className="card-body d-flex flex-column align-items-center justify-content-center gap-3" style={{ flex: "1 0 auto" }}>
                        <h2 className="card-title mb-3">Almacén</h2>
                        <label className="w-100">
                            Usuario:
                            <input
                                type="text"
                                className="form-control mt-1"
                                placeholder="Ingresa tu usuario"
                                value={nombre_usuario}
                                onChange={(e) => setNombreUsuario(e.target.value)}
                            />
                        </label>
                        <label className="w-100 mt-4">
                            Contraseña:
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <button className="btn btn-primary w-100" onClick={handleLogin}>
                            Iniciar Sesión
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        ¿No tienes una cuenta? <a href="#">¡Regístrate aquí!</a>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0" style={{ width: "30%" }}>
                <img src={banner} className="w-100 h-100" style={{ objectFit: "cover" }} />
            </div>
        </div>
    );
};

