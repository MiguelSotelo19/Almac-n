import { useNavigate } from "react-router-dom";
import "./css/Header.css";

export const Header = () => {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        navigate("/Almacen/IniciarSesion");
    };

    return (
        <header className="header px-5">
            <div className="header-content">
                <div className="logo-container">
                    <p className="logo">🧃 Almacén Supremo</p>
                </div>
                <div className="nav-buttons">
                    <button className="cool-btn" onClick={() => navigate("/Almacen/Almacenes")}>Almacenes</button>
                    <button className="cool-btn" onClick={() => navigate("/Almacen/Usuarios")}>Usuarios</button>
                </div>
                <div>
                    <button className="logout-btn" onClick={cerrarSesion}>Cerrar sesión</button>
                </div>
            </div>
        </header>
    );
};
