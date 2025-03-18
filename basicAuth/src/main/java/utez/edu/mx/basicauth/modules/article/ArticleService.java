package utez.edu.mx.basicauth.modules.article;

import org.springframework.stereotype.Service;
import utez.edu.mx.basicauth.modules.article.dto.ArticleDTO;
import utez.edu.mx.basicauth.modules.category.Category;
import utez.edu.mx.basicauth.modules.category.CategoryRepository;
import utez.edu.mx.basicauth.modules.storages.Storages;
import utez.edu.mx.basicauth.modules.storages.StoragesRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;
    private final StoragesRepository storagesRepository;

    public ArticleService(ArticleRepository articleRepository, CategoryRepository categoryRepository, StoragesRepository storagesRepository) {
        this.articleRepository = articleRepository;
        this.categoryRepository = categoryRepository;
        this.storagesRepository = storagesRepository;
    }

    public List<ArticleDTO> getAllArticles() {
        return articleRepository.findAll().stream()
                .map(article -> new ArticleDTO(
                        article.getId(),
                        article.getTitle(),
                        article.getDescription(),
                        article.getCategory().getId(),
                        article.getStorage().getId()
                ))
                .collect(Collectors.toList());
    }

    public ArticleDTO createArticle(ArticleDTO articleDto) {
        Article article = new Article();
        article.setTitle(articleDto.getTitle());
        article.setDescription(articleDto.getDescription());

        Category category = categoryRepository.findById(articleDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        article.setCategory(category);

        Storages storage = storagesRepository.findById(articleDto.getStorageId())
                .orElseThrow(() -> new RuntimeException("Storage not found"));
        article.setStorage(storage);

        article = articleRepository.save(article);
        return new ArticleDTO(article.getId(), article.getTitle(), article.getDescription(), category.getId(), storage.getId());
    }

    public String updateArticle(Long id, ArticleDTO articleDto) {
        Optional<Article> optionalArticle = articleRepository.findById(id);
        if (optionalArticle.isPresent()) {
            Article article = optionalArticle.get();
            article.setTitle(articleDto.getTitle());
            article.setDescription(articleDto.getDescription());

            Category category = categoryRepository.findById(articleDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada."));
            article.setCategory(category);

            Storages storage = storagesRepository.findById(articleDto.getStorageId())
                    .orElseThrow(() -> new RuntimeException("Almacén no encontrado."));
            article.setStorage(storage);

            articleRepository.save(article);
            return "Artículo actualizado exitosamente.";
        }
        return "Artículo no encontrado.";
    }

    public String deleteArticle(Long id) {
        if (articleRepository.existsById(id)) {
            articleRepository.deleteById(id);
            return "Artículo eliminado exitosamente.";
        }
        return "Artículo no encontrado.";
    }
}
