package utez.edu.mx.basicauth.modules.test;

//BA06 - Crear las rutas para test de nuestra seguridad/filtros/interceptores

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/*test")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("")
    public ResponseEntity<?> test() {
        Map<String, String> body = new HashMap<>();
        body.put("message", "Operación exitosa");

        return new ResponseEntity<>(body, HttpStatus.OK);
    }

    @GetMapping("/secured")
    public ResponseEntity<?> testSecured() {
        Map<String, String> body = new HashMap<>();
        body.put("message", "Operación exitosa");

        return new ResponseEntity<>(body, HttpStatus.OK);
    }

}


//Siguiente -- Crear las configuraciones de ruta en MainSecurity