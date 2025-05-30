package utez.edu.mx.basicauth.modules.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.basicauth.modules.auth.dto.LoginDTO;
import utez.edu.mx.basicauth.modules.auth.dto.RegisterDTO;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        return authService.login(dto);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO dto) {
        return authService.register(dto);
    }
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return authService.getAllUsers();
    }

    @GetMapping("/username/{username}")
    public User getUser(@PathVariable String username) {
        return authService.getUser(username);
    }

    @GetMapping("/users/responsables")
    public List<User> getResponsables(){
        return authService.getResponsables();
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = authService.saveUser(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }


    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDTO) {
        return authService.updateUser(id, userDTO);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (authService.deleteUser(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/users/{id}/password")
    public User updatePassword(@PathVariable Long id, @RequestBody User.PasswordDTO passwordDTO) {
        return authService.updatePassword(id, passwordDTO.getPassword());
    }

}
