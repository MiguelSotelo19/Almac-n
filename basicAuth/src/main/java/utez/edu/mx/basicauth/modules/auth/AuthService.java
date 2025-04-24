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
import utez.edu.mx.basicauth.modules.storages.Storages;
import utez.edu.mx.basicauth.modules.storages.StoragesRepository;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StoragesRepository storageRepository;

    @Autowired
    private CustomResponse customResponse;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(rollbackOn = {SQLException.class, Exception.class})
    public ResponseEntity<?> login(LoginDTO dto) {
        User found = userRepository.findByEmail(dto.getEmail());

        if (found != null && passwordEncoder.matches(dto.getPassword(), found.getPassword())) {
            return customResponse.getOkResponse("tokenbearer." + found.getUsername() + ".voidtoken");
        } else {
            return customResponse.get404Response(404);
        }
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUser(String email){
        return userRepository.findByEmail(email);
    }

    public List<User> getResponsables(){
        return userRepository.findAllByResponsable();
    }


    public User updateUser(Long id, User userDTO) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User user = existingUser.get();

            if (!userDTO.getUsername().matches("^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre debe tener al menos nombre y apellido, y solo letras.");
            }

            user.setUsername(userDTO.getUsername());

            if (userDTO.getPassword() != null && !userDTO.getPassword().trim().isEmpty()) {
                if (!userDTO.getPassword().matches("^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$")) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña debe contener al menos 8 caracteres, una mayúscula, un número y un carácter especial.");
                }
                user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }

            user.setEmail(userDTO.getEmail());
            user.setRol(userDTO.getRol());
            return userRepository.save(user);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
    }

    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public boolean deleteUser(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Buscar todos los almacenes que tengan asignado este usuario
            List<Storages> almacenes = storageRepository.findByUser(user);
            for (Storages almacen : almacenes) {
                almacen.setUser(null); // Desvincular el usuario
                storageRepository.save(almacen); // Guardar el cambio
            }

            // Eliminar el usuario
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
    @Transactional(rollbackOn = {SQLException.class, Exception.class})
    public ResponseEntity<?> register(RegisterDTO dto) {
        String username = dto.getUsername() != null ? dto.getUsername().trim() : "";
        String email = dto.getEmail() != null ? dto.getEmail().trim().toLowerCase() : "";
        String password = dto.getPassword() != null ? dto.getPassword() : "";

        // Validación de nombre (nombre + apellido, solo letras y espacios)
        if (!username.matches("^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$")) {
            return customResponse.getErrorResponse("El nombre debe tener al menos nombre y apellido, y solo letras.");
        }

        // Validación de email
        if (email.isBlank() || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            return customResponse.getErrorResponse("Introduce un correo electrónico válido.");
        }

        // Validación de contraseña
        if (!password.matches("^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$")) {
            return customResponse.getErrorResponse("La contraseña debe contener al menos 8 caracteres, una mayúscula, un número y un carácter especial.");
        }
        if (password.contains(" ")) {
            return customResponse.getErrorResponse("La contraseña no debe contener espacios.");
        }
        if (password.toLowerCase().contains(username.toLowerCase()) || password.toLowerCase().contains(email.toLowerCase())) {
            return customResponse.getErrorResponse("La contraseña no debe contener tu nombre ni tu correo.");
        }

        // Verificación de usuario existente
        if (userRepository.existsByUsername(dto.getUsername())) {
            return customResponse.getErrorResponse("El usuario ya existe");
        }
        if (userRepository.existsByEmail(email)) {
            return customResponse.getErrorResponse("El correo electrónico ya está registrado.");
        }

        // Crear y guardar usuario
        User newUser = new User();
        newUser.setUsername(dto.getUsername());
        newUser.setEmail(dto.getEmail());
        newUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        newUser.setRol(dto.getRol() != null ? dto.getRol() : "USER");

        User savedUser = userRepository.save(newUser);
        return customResponse.getCreatedResponse(savedUser);
    }

    public User updatePassword(Long id, String rawPassword) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setPassword(passwordEncoder.encode(rawPassword));
            return userRepository.save(user);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
    }


}
