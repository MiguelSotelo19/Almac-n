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
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errores, setErrores] = useState({});


    const handleRegister = async () => {
        const nuevosErrores = {};

        // Validación de nombre
        if (!nombre_usuario) {
            nuevosErrores.nombre_usuario = "Por favor, ingresa tu nombre completo.";
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/.test(nombre_usuario.trim())) {
            nuevosErrores.nombre_usuario = "El nombre debe tener al menos nombre y apellido, y solo letras.";
        } else if (/\d/.test(nombre_usuario)) {
            nuevosErrores.nombre_usuario = "El nombre no debe contener números.";
        } else if (/^\s|\s$/.test(nombre_usuario)) {
            nuevosErrores.nombre_usuario = "El nombre no debe comenzar ni terminar con espacios.";
        }

        // Validación de email
        if (!email) {
            nuevosErrores.email = "Por favor, ingresa tu correo electrónico.";
        } else if (/\s/.test(email)) {
            nuevosErrores.email = "El correo electrónico no debe contener espacios.";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            nuevosErrores.email = "Introduce un correo electrónico válido.";
        }

        // Validación de contraseña
        if (!password) {
            nuevosErrores.password = "Por favor, ingresa una contraseña.";
        } else if (/\s/.test(password)) {
            nuevosErrores.password = "La contraseña no debe contener espacios.";
        } else if (password.length < 8) {
            nuevosErrores.password = "La contraseña debe tener al menos 8 caracteres.";
        } else if (!/[A-Z]/.test(password)) {
            nuevosErrores.password = "La contraseña debe contener al menos una mayúscula.";
        } else if (!/\d/.test(password)) {
            nuevosErrores.password = "La contraseña debe contener al menos un número.";
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            nuevosErrores.password = "La contraseña debe contener al menos un carácter especial.";
        } else if (
            password.toLowerCase().includes(nombre_usuario?.toLowerCase()) ||
            password.toLowerCase().includes(email?.toLowerCase())
        ) {
            nuevosErrores.password = "La contraseña no debe contener tu nombre o correo.";
        }

        // Confirmación de contraseña
        if (!confirmPassword) {
            nuevosErrores.confirmPassword = "Por favor, confirma tu contraseña.";
        } else if (password !== confirmPassword) {
            nuevosErrores.confirmPassword = "Las contraseñas deben ser iguales.";
        }

        // Si hay errores, se detiene
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        // Si todo está bien, continua
        setErrores({});

        try {
            const response = await axios.post("http://127.0.0.1:8080/api/auth/register", {
                username: nombre_usuario.trim(),
                password,
                email: email.toLowerCase().trim(),
                rol: "RESPONSABLE"
            });

            if (response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Registro exitoso",
                    text: "Ahora puedes iniciar sesión.",
                }).then(() => {
                    navigate("/Almacen/");
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
                <div className="card p-4 w-50 d-flex flex-column" style={{ backgroundColor: "#2e2e3f", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)", color: "white" }}>
                    <div className="card-body d-flex flex-column align-items-center justify-content-center gap-3" style={{ flex: "1 0 auto" }}>
                        <h2 className="card-title mb-3">Registro</h2>
                        <label className="w-100">
                            Nombre Completo:
                            <input
                                type="text"
                                className={`form-control mt-1 ${errores.nombre_usuario ? "is-invalid" : ""}`}
                                placeholder="Ingresa tu nombre"
                                value={nombre_usuario}
                                onChange={(e) => setNombreUsuario(e.target.value)}
                            />
                            {errores.nombre_usuario && <div className="invalid-feedback">{errores.nombre_usuario}</div>}
                        </label>
                        <label className="w-100 mt-2">
                            Correo electrónico:
                            <input
                                type="email"
                                className={`form-control mt-1 ${errores.email ? "is-invalid" : ""}`}
                                placeholder="Ingresa tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errores.email && <div className="invalid-feedback">{errores.email}</div>}
                        </label>
                        <label className="w-100 mt-2">
                            Contraseña:
                            <input
                                type="password"
                                className={`form-control mt-1 ${errores.password ? "is-invalid" : ""}`}
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errores.password && <div className="invalid-feedback">{errores.password}</div>}
                        </label>

                        <label className="w-100 mt-2">
                            Confirmar Contraseña:
                            <input
                                type="password"
                                className={`form-control mt-1 ${errores.confirmPassword ? "is-invalid" : ""}`}
                                placeholder="Confirma tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {errores.confirmPassword && <div className="invalid-feedback">{errores.confirmPassword}</div>}
                        </label>
                        <button className="btn btn-primary w-100 mt-2" onClick={handleRegister}>
                            Registrarse
                        </button>
                    </div>

                    <div className="mt-2 text-center">
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
