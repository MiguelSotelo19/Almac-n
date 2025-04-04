package utez.edu.mx.basicauth.modules.storages;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoragesRepository extends JpaRepository<Storages, Long> {
    Optional<Storages> findByUser_Id(Long userId);

}
