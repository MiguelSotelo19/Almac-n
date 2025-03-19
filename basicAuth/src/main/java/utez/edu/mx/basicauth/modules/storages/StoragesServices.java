package utez.edu.mx.basicauth.modules.storages;

import org.springframework.stereotype.Service;
import utez.edu.mx.basicauth.modules.category.Category;
import utez.edu.mx.basicauth.modules.category.CategoryRepository;
import utez.edu.mx.basicauth.modules.storages.dto.StoragesDTO;

import java.util.List;
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
}
