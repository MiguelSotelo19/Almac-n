import { Link } from "react-router-dom";
import "./css/error.css"; 

export const E401 = () => (
    <main className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white text-center p-4" id="oopss ">
        <div className="container" id="error-text">
            <div className="forbidden-sign mb-4"></div>
            <span>401</span>
            <h2 className="mb-3">Acceso restringido</h2>
            <p className="lead">
                Esta página está protegida<br />
                Debes autenticarte para acceder a ella
            </p>
            <Link to="/" className="btn btn-warning mt-4 px-4 py-2 fw-semibold shadow">
                Volver al inicio
            </Link>
        </div>
    </main>
);
