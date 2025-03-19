package utez.edu.mx.basicauth.modules.category;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.basicauth.modules.category.dto.CategoryDTO;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryDTO(category.getCategory_id(), category.getName()))
                .collect(Collectors.toList());
    }

    public CategoryDTO createCategory(CategoryDTO categoryDto) {
        Category category = new Category();
        category.setName(categoryDto.getName());
        category = categoryRepository.save(category);
        return new CategoryDTO(category.getCategory_id(), category.getName());
    }

    public ResponseEntity<String> updateCategory(Long id, CategoryDTO categoryDTO){
        Optional<Category> OptionalCategory = categoryRepository.findById(id);
        if (OptionalCategory.isPresent()){
            Category category = OptionalCategory.get();
            category.setName(categoryDTO.getName());
            category = categoryRepository.save(category);
            return ResponseEntity.ok("Categoria actualizada exitosamente.");
        }
        return ResponseEntity.status(404).body("Categoria no encontrada.");
    }

    public ResponseEntity<String> deleteCategory(Long id){
        if (categoryRepository.existsById(id)){
            categoryRepository.deleteById(id);
            return ResponseEntity.ok("categoria eliminada exitosamente.");
        }
        return ResponseEntity.status(404).body("categoria no encontrada.");
    }
}

