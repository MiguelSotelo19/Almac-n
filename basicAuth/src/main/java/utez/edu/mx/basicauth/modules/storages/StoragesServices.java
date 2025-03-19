package utez.edu.mx.basicauth.modules.storages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.basicauth.modules.category.Category;
import utez.edu.mx.basicauth.modules.category.CategoryRepository;
import utez.edu.mx.basicauth.modules.storages.dto.StoragesDTO;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StoragesServices {
    private final StoragesRepository storagesRepository;
    private final CategoryRepository categoryRepository;

    public StoragesServices(StoragesRepository storagesRepository, CategoryRepository categoryRepository) {
        this.storagesRepository = storagesRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<StoragesDTO> getAllStorages() {
        return storagesRepository.findAll().stream()
                .map(storage -> new StoragesDTO(storage.getId(), storage.getLocation(), storage.getCategory().getCategory_id()))
                .collect(Collectors.toList());
    }

    public StoragesDTO createStorage(StoragesDTO storagesDto) {
        Storages storage = new Storages();
        storage.setLocation(storagesDto.getLocation());
        Category category = categoryRepository.findById(storagesDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        storage.setCategory(category);
        storage = storagesRepository.save(storage);
        return new StoragesDTO(storage.getId(), storage.getLocation(), storage.getCategory().getCategory_id());
    }

    public ResponseEntity<String> updateStorage(Long id, StoragesDTO storagesDto) {
        Optional<Storages> optionalStorage = storagesRepository.findById(id);
        if (optionalStorage.isPresent()) {
            Storages storage = optionalStorage.get();
            storage.setLocation(storagesDto.getLocation());
            storagesRepository.save(storage);
            return ResponseEntity.ok("Localización actualizada exitosamente.");
        }
        return ResponseEntity.status(404).body("Localización no encontrada.");
    }
    public ResponseEntity<String> deleteStorage(Long id) {
        if (storagesRepository.existsById(id)) {
            storagesRepository.deleteById(id);
            return ResponseEntity.ok("Localización eliminada exitosamente.");
        }
        return ResponseEntity.status(404).body("Localización no encontrada.");
    }
}
