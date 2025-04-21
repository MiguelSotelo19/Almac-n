import { useNavigate } from "react-router-dom";
import "./css/Header.css";

export const Header = () => {
    const navigate = useNavigate();
    const userLogg = JSON.parse(localStorage.getItem("userLogg"));

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        navigate("/Almacen/");
    };

    return (
        <header className="header px-5">
            <div className="header-content">
                <div className="logo-container">
                    <p className="logo">🧃 Almacén Supremo</p>
                </div>
                <div className="nav-buttons">
                    {userLogg.rol != "ADMIN" ? null : (
                        <>
                        <button className="cool-btn" onClick={() => navigate("/Almacen/Almacenes")}>Almacenes</button>
                        <button className="cool-btn" onClick={() => navigate("/Almacen/Usuarios")}>Usuarios</button>
                        <button className="cool-btn" onClick={() => navigate("/Almacen/Bitacora")}>Bitacora</button>
                        </>
                    )}
                </div>
                <div>
                    <button className="logout-btn" onClick={cerrarSesion}>Cerrar sesión</button>
                </div>
            </div>
        </header>
    );
};
