import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle"

import banner from '../assets/banner.jpg';

export const Login = () => {
    return(
    <>
    <div className="d-flex vh-100">
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="card p-4 w-50 d-flex flex-column">
            <div className="card-body d-flex flex-column align-items-center justify-content-center gap-3" style={{ flex: '1 0 auto' }}>
                <h2 className="card-title mb-3">MiauSpace</h2>
                <label className="w-100">Usuario:
                    <input type="text" className="form-control mt-1" placeholder="Ingresa tu usuario" />
                </label>
                <label className="w-100 mt-4">Contraseña:
                    <input type="password" className="form-control mt-1" placeholder="Ingresa tu contraseña" />
                </label>
                <button className="btn btn-primary w-100" onClick={() => { navigate('/MiauSpace/Home') }}>Iniciar Sesión</button>
            </div>

            <div className="mt-4 text-center">
                ¿No tienes una cuenta? <a href="#">¡Regístrate aquí!</a>
            </div>
            </div>
        </div>
        
        <div className="flex-shrink-0" style={{ width: '30%' }}>
            <img src={banner} className="w-100 h-100" style={{ objectFit: 'cover' }} />
        </div>
    </div>
    </>
    );
}