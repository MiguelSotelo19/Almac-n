package utez.edu.mx.basicauth.modules.storages;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.basicauth.modules.auth.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoragesRepository extends JpaRepository<Storages, Long> {
    Optional<Storages> findByUser_Id(Long userId);
    List<Storages> findByUser(User user);
}
