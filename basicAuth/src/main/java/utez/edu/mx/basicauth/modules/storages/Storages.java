package utez.edu.mx.basicauth.modules.storages;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import utez.edu.mx.basicauth.modules.article.Article;
import utez.edu.mx.basicauth.modules.auth.User;
import utez.edu.mx.basicauth.modules.category.Category;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Storages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String location;

    @OneToMany(mappedBy = "storage")
    private List<Article> articles;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToOne
    @JoinColumn(name = "empleado_id")
    private User user;
}
