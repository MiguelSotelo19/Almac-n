import { useNavigate } from "react-router-dom";

export const Header  = () => {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem("token"); 
        navigate("/Almacen/IniciarSesion");
    }

    return(
        <>
        <header className="ps-5 pe-5" style={{borderBottom: '1px solid gray', height: '80px'}}>
            <div className="d-flex align-items-center justify-content-between p-2">
                <div className="d-flex align-items-center justify-content-center">
                    <p className="logo">Almacén</p>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                    <button className="btn btn-danger" onClick={() => cerrarSesion()}>Cerrar sesión</button>
                </div>
            </div>
        </header>
        </>
    );
}