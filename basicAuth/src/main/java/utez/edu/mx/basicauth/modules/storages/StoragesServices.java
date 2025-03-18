package utez.edu.mx.basicauth.modules.storages;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import utez.edu.mx.basicauth.modules.storages.dto.StoragesDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoragesServices {
    private final StoragesRepository storagesRepository;

    public StoragesServices(StoragesRepository storagesRepository) {
        this.storagesRepository = storagesRepository;
    }

    public List<StoragesDTO> getAllStorages() {
        return storagesRepository.findAll().stream()
                .map(storage -> new StoragesDTO(storage.getId(), storage.getLocation()))
                .collect(Collectors.toList());
    }

    public StoragesDTO createStorage(StoragesDTO storagesDto) {
        Storages storage = new Storages();
        storage.setLocation(storagesDto.getLocation());
        storage = storagesRepository.save(storage);
        return new StoragesDTO(storage.getId(), storage.getLocation());
    }
}
