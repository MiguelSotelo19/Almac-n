package utez.edu.mx.basicauth.modules.category;

import org.springframework.stereotype.Service;
import utez.edu.mx.basicauth.modules.category.dto.CategoryDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryDTO(category.getId(), category.getName()))
                .collect(Collectors.toList());
    }

    public CategoryDTO createCategory(CategoryDTO categoryDto) {
        Category category = new Category();
        category.setName(categoryDto.getName());
        category = categoryRepository.save(category);
        return new CategoryDTO(category.getId(), category.getName());
    }
}

