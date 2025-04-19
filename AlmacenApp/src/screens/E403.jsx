import { Link } from "react-router-dom";
import "./css/error.css"; 

export const E403 = () => (
    <main className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white text-center p-4" id="oopss ">
        <div className="container" id="error-text">
            <div className="forbidden-sign mb-4"></div>
            <span>403</span>
            <h2 className="mb-3">Acceso prohibido</h2>
            <p className="lead">
                No tienes permisos suficientes para ver esta página.<br />
                Si crees que es un error, contacta al administrador del sistema.
            </p>
            <Link to="/" className="btn btn-warning mt-4 px-4 py-2 fw-semibold shadow">
                Volver
            </Link>
        </div>
    </main>
);
