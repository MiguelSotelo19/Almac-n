import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import { useEffect } from "react";

import banner from "../assets/banner.jpeg";

export const Login = () => {
    const urlLogin = 'http://127.0.0.1:8080/api/auth/login';

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isAuthenticated = () => {
        return !!localStorage.getItem("token"); 
    };
    

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/Almacen/", { replace: true });
        }
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Swal.fire({
                icon: "warning",
                title: "Campos vacíos",
                text: "Por favor, ingresa tu correo electrónico y contraseña.",
            });
            return;
        }
    
        try {
            const response = await axios.post(urlLogin, {
                "email": email,
                "password": password,
            }, {
                withCredentials: true
            });
            

            if (response.status === 200) {
                localStorage.setItem("token", response.data.data);
                
                const responseUser = await axios.get("http://localhost:8080/api/auth/users", {
                    headers: { Authorization: `Bearer ${response.data.data}` },
                });
                
                const usuarios = responseUser.data;
                const usuarioLogueado = usuarios.find(u => u.email === email);

                if (usuarioLogueado) {
                    localStorage.setItem("rol", usuarioLogueado.rol);
                    localStorage.setItem("userLogg", JSON.stringify(usuarioLogueado));
                }
                Swal.fire({
                    icon: "success",
                    title: "Inicio de sesión exitoso",
                    text: "Bienvenido a Almacén 👻",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    navigate("/Almacen/Almacenes");
                });
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    navigate("/401");
                } else if (error.response.status === 403) {
                    navigate("/403");
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error en el inicio de sesión",
                        text: "Usuario o contraseña incorrectos.",
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: "No se pudo conectar con el servidor.",
                });
            }
        }
    };
    
    return (
        <div className="d-flex vh-100" style={{ background: "linear-gradient(135deg, #1e1e2f, #3c3c52)" }}>
            <div className="flex-grow-1 d-flex align-items-center justify-content-center" >
                <div className="card p-4 w-50 d-flex flex-column" style={{ backgroundColor:"#2e2e3f", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)", color:"white"}}>
                    <div className="card-body d-flex flex-column align-items-center justify-content-center gap-3" style={{ flex: "1 0 auto"}}>
                        <h2 className="card-title mb-3">Almacén</h2>
                        <label className="w-100">
                            Correo electrónico:
                            <input
                                type="email"
                                className="form-control mt-1"
                                placeholder="Ingresa tu correo electronico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                    ¿No tienes una cuenta? <Link to="/Almacen/registro">¡Regístrate aquí!</Link>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0" style={{ width: "30%" }}>
                <img src={banner} className="w-100 h-100" style={{ objectFit: "cover" }} />
            </div>
        </div>
    );
};

