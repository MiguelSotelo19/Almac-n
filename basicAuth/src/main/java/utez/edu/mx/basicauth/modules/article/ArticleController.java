package utez.edu.mx.basicauth.modules.article;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.basicauth.modules.article.dto.ArticleDTO;

import java.util.List;

@RestController
@RequestMapping("/articles")
public class ArticleController {
    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public List<ArticleDTO> getAllArticles() {
        return articleService.getAllArticles();
    }

    @PostMapping
    public ArticleDTO createArticle(@RequestBody ArticleDTO articleDto) {
        return articleService.createArticle(articleDto);
    }

    @PutMapping("/{id}")
    public String updateArticle(@PathVariable Long id, @RequestBody ArticleDTO articleDto) {
        return articleService.updateArticle(id, articleDto);
    }

    @DeleteMapping("/{id}")
    public String deleteArticle(@PathVariable Long id) {
        return articleService.deleteArticle(id);
    }
}
