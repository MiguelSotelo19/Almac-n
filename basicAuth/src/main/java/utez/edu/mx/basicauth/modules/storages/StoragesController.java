package utez.edu.mx.basicauth.modules.storages;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.basicauth.modules.storages.dto.StoragesDTO;

import java.util.List;

@RestController
@RequestMapping("/storages")
public class StoragesController {
    private final StoragesServices storagesService;

    public StoragesController(StoragesServices storagesService) {
        this.storagesService = storagesService;
    }

    @GetMapping
    public List<StoragesDTO> getAllStorages() {
        return storagesService.getAllStorages();
    }

    @PostMapping
    public StoragesDTO createStorage(@RequestBody StoragesDTO storagesDto) {
        return storagesService.createStorage(storagesDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateStorage(@PathVariable Long id, @RequestBody StoragesDTO storagesDto) {
        return storagesService.updateStorage(id, storagesDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStorage(@PathVariable Long id) {
        return storagesService.deleteStorage(id);
    }

}
