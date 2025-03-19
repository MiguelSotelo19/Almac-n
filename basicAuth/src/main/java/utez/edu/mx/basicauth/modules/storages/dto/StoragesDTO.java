package utez.edu.mx.basicauth.modules.storages.dto;

public class StoragesDTO {
    private Long id;
    private String location;
    private Long categoryId;

    public StoragesDTO() {}

    public StoragesDTO(Long id, String location) {
        this.id = id;
        this.location = location;
    }

    public StoragesDTO(Long id, String location, Long categoryId) {
        this.id = id;
        this.location = location;
        this.categoryId = categoryId;
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
}
