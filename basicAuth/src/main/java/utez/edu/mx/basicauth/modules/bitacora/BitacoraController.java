package utez.edu.mx.basicauth.modules.bitacora;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bitacora")
public class BitacoraController {
    @Autowired
    private BitacoraService bitacoraService;

    @GetMapping
    public List<Bitacora> obtenerBitacora(){
        return bitacoraService.obtenerTodas();
    }
}
