package utez.edu.mx.basicauth.modules.bitacora;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BitacoraService {
    @Autowired

    private BitacoraRepository bitacoraRepository;

    public List<Bitacora> obtenerTodas() {
        return bitacoraRepository.findAll();
    }
    public void registrar(String usuario, String metodoHttp, String endpoint) {
        Bitacora bitacora = new Bitacora();
        bitacora.setUsuario(usuario);
        bitacora.setMetodoHttp(metodoHttp);
        bitacora.setEndpoint(endpoint);
        bitacora.setFechaHora(LocalDateTime.now());

        bitacoraRepository.save(bitacora);
    }

    public void eliminarTodaLaBitacora() {
        bitacoraRepository.deleteAll();
    }

}
