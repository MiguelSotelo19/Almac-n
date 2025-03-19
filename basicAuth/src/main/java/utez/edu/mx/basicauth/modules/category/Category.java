package utez.edu.mx.basicauth.modules.category;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import utez.edu.mx.basicauth.modules.article.Article;
import utez.edu.mx.basicauth.modules.storages.Storages;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long category_id;
    private String name;

    @OneToMany(mappedBy = "category")
    private List<Article> articles;

    @OneToMany(mappedBy = "category")
    private List<Storages> storages;
}
