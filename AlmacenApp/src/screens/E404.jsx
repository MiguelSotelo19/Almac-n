import "./css/error.css";
import { Link } from "react-router-dom";

export const E404 = () => {

    return (
        <div id='oopss'>
            <div id='error-text' className="">
                <span>404</span>
                <h1>Página no encontrada</h1>
                <p className="">El contenido que intentas visitar no está disponible o ha sido movido</p>
                <div className="btn-volver">
                    <Link to="/" className="back">Volver al inicio</Link>
                </div>
            </div>
        </div>
    );
};
