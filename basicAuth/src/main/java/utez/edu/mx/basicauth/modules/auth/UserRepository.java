package utez.edu.mx.basicauth.modules.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByUsername(String email); //Sirve para el register
    boolean existsByEmail(String email);

    @Query(value = "SELECT * FROM user WHERE email = :email AND password = :password;", nativeQuery = true)
    User findByUsernameAndPassword(@Param("email") String email, @Param("password") String password);

    @Query(value = "SELECT * FROM user WHERE username = :username;", nativeQuery = true)
    User findByUsername(@Param("username") String username);

    @Query(value = "SELECT * FROM user WHERE email = :email;", nativeQuery = true)
    User findByEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM user", nativeQuery = true)
    List<User> findAll();

    @Query(value = "SELECT * FROM user WHERE rol = 'RESPONSABLE'", nativeQuery = true)
    List<User> findAllByResponsable();
}
