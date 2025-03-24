package utez.edu.mx.basicauth.modules.storages.dto;

public class StoragesDTO {
    private Long id;
    private String location;
    private Long categoryId;
    private Long userId;

    public StoragesDTO() {}

    public StoragesDTO(Long id, String location) {
        this.id = id;
        this.location = location;
    }

    public StoragesDTO(Long id, String location, Long categoryId, Long userId ){
        this.id = id;
        this.location = location;
        this.categoryId = categoryId;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Long getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
