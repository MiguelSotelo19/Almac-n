package utez.edu.mx.basicauth.modules.bitacora;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bitacora")
public class Bitacora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String usuario;
    @Column(nullable = false)
    private String metodoHttp;
    @Column(nullable = false)
    private String endpoint;
    @Column(nullable = false)
    private LocalDateTime fechaHora;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getMetodoHttp() {
        return metodoHttp;
    }

    public void setMetodoHttp(String metodoHttp) {
        this.metodoHttp = metodoHttp;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }
}
