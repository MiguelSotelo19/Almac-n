package utez.edu.mx.basicauth.modules.bitacora;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping
    public ResponseEntity<Void> eliminarBitacora(@RequestHeader("Authorization") String authHeader) {
        bitacoraService.eliminarTodaLaBitacora();
        return ResponseEntity.noContent().build();
    }
}
