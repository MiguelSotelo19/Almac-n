package utez.edu.mx.basicauth.modules.auth;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.basicauth.kernel.CustomResponse;
import utez.edu.mx.basicauth.modules.auth.dto.LoginDTO;

import java.sql.SQLException;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomResponse customResponse;

    @Transactional(rollbackOn = {SQLException.class, Exception.class})
    public ResponseEntity<?> login(LoginDTO dto){
        User found = userRepository.findByUsernameAndPassword(dto.getUsername(), dto.getPassword());
        if(found != null){
            return customResponse.getOkResponse("tokenbearer."+found.getUsername()+".voidtoken");
        } else {
            return customResponse.get404Response(404);
        }
    }

}
