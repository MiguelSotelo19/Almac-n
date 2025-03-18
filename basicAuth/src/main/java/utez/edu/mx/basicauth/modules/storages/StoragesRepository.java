package utez.edu.mx.basicauth.modules.storages;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoragesRepository extends JpaRepository<Storages, Long> {
}
