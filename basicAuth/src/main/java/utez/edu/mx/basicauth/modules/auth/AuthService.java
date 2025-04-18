package utez.edu.mx.basicauth.modules.auth;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import utez.edu.mx.basicauth.kernel.CustomResponse;
import utez.edu.mx.basicauth.modules.auth.dto.LoginDTO;
import utez.edu.mx.basicauth.modules.auth.dto.RegisterDTO;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomResponse customResponse;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(rollbackOn = {SQLException.class, Exception.class})
    public ResponseEntity<?> login(LoginDTO dto) {
        User found = userRepository.findByUsername(dto.getUsername());

        if (found != null && passwordEncoder.matches(dto.getPassword(), found.getPassword())) {
            return customResponse.getOkResponse("tokenbearer." + found.getUsername() + ".voidtoken");
        } else {
            return customResponse.get404Response(404);
        }
    }
    public List<User> getAllUsers() {
        return userRepository.findAllNonAdminUsers();
    }

    public User getUser(String username){
        return userRepository.findByUsername(username);
    }

    public List<User> getResponsables(){
        return userRepository.findAllByResponsable();
    }


    public User updateUser(Long id, LoginDTO userDTO) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setUsername(userDTO.getUsername());
            user.setPassword(userDTO.getPassword());
            return userRepository.save(user);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
    @Transactional(rollbackOn = {SQLException.class, Exception.class})
    public ResponseEntity<?> register(RegisterDTO dto) {
        // Verificación de usuario existente
        if (userRepository.existsByUsername(dto.getUsername())) {
            return customResponse.getErrorResponse("El usuario ya existe");
        }

        // Crear y guardar usuario
        User newUser = new User();
        newUser.setUsername(dto.getUsername());
        newUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        newUser.setRol(dto.getRol() != null ? dto.getRol() : "USER");

        User savedUser = userRepository.save(newUser);
        return customResponse.getCreatedResponse(savedUser);
    }
}
