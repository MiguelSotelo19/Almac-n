package utez.edu.mx.basicauth.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import utez.edu.mx.basicauth.modules.bitacora.BitacoraInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Autowired
    private BitacoraInterceptor bitacoraInterceptor;
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(bitacoraInterceptor);
    }
}
