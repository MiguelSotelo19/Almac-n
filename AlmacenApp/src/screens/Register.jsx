import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import banner from "../assets/banner.jpeg";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const Register = () => {
    const navigate = useNavigate();
    const [nombre_usuario, setNombreUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
        if (!nombre_usuario || !password || !confirmPassword) {
            Swal.fire({
                icon: "warning",
                title: "Campos vacíos",
                text: "Por favor, completa todos los campos.",
            });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Contraseñas no coinciden",
                text: "Las contraseñas deben ser iguales.",
            });
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8080/api/auth/register", {
                username: nombre_usuario,
                password: password,
                rol: "RESPONSABLE"
            });

            if (response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Registro exitoso",
                    text: "Ahora puedes iniciar sesión.",
                }).then(() => {
                    navigate("/Almacen/"); // Redirige al login
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error en el registro",
                text: error.response?.data?.message || "Ocurrió un error al registrarse.",
            });
        }
    };

    return (
        <div className="d-flex vh-100" style={{ background: "linear-gradient(135deg, #1e1e2f, #3c3c52)" }}>
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="card p-4 w-50 d-flex flex-column" style={{ backgroundColor:"#2e2e3f", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)", color:"white"}}>
                    <div className="card-body d-flex flex-column align-items-center justify-content-center gap-3" style={{ flex: "1 0 auto" }}>
                        <h2 className="card-title mb-3">Registro</h2>
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
                        <label className="w-100 mt-4">
                            Confirmar Contraseña:
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Confirma tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </label>
                        <button className="btn btn-primary w-100" onClick={handleRegister}>
                            Registrarse
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        ¿Ya tienes una cuenta? <Link to="/Almacen/">Inicia sesión aquí</Link>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0" style={{ width: "30%" }}>
                <img src={banner} className="w-100 h-100" style={{ objectFit: "cover" }} />
            </div>
        </div>
    );
};
