package utez.edu.mx.basicauth.modules.bitacora;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
@Component
public class BitacoraInterceptor implements HandlerInterceptor {
    @Autowired
    private BitacoraService bitacoraService;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String metodo = request.getMethod();
        String uri = request.getRequestURI();
        String usuario = request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "ANÓNIMO";

        bitacoraService.registrar(usuario, metodo, uri);

        return true;
    }
}
