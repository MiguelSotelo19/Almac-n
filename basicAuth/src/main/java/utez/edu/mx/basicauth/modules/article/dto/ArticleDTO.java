package utez.edu.mx.basicauth.modules.article.dto;

public class ArticleDTO {
    private Long id;
    private String title;
    private String description;
    private Long cantidad;
    private Long categoryId;
    private Long storageId;

    public ArticleDTO() {}

    public ArticleDTO(Long id, String title, String description, Long cantidad, Long categoryId, Long storageId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.cantidad = cantidad;
        this.categoryId = categoryId;
        this.storageId = storageId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getStorageId() { return storageId; }
    public void setStorageId(Long storageId) { this.storageId = storageId; }

    public Long getCantidad() {
        return cantidad;
    }

    public void setCantidad(Long cantidad) {
        this.cantidad = cantidad;
    }
}
