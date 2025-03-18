package utez.edu.mx.basicauth.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import utez.edu.mx.basicauth.security.filter.AuthFilter;
import utez.edu.mx.basicauth.security.interceptors.CustomInterceptor;

//BA04 -- Crear la clase de configuración de seguridad
@CrossOrigin(origins = "http://localhost:5173")
@EnableWebSecurity
@Configuration
public class MainSecurity implements WebMvcConfigurer {
    //Apartado para importar nuestros filtros, interceptores, repositorios
    @Autowired
    private AuthFilter authFilter;

    @Autowired
    private CustomInterceptor customInterceptor;

    private final static String[] WHITE_LIST = {
            "/api/test",
            "/api/auth/login"
    };

    public static String[] getWHITE_LIST() {
        return WHITE_LIST;
    }

    // Crear el objeto de configuración de seguridad (FilterChain)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowCredentials(true);
                    config.addAllowedOrigin("http://localhost:5173"); // Permite frontend local
                    config.addAllowedMethod("*"); // Permite GET, POST, PUT, DELETE, etc.
                    config.addAllowedHeader("*"); // Permite todos los headers
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth
                        //BA07 -- Crear las configuraciones de rutas
                        .requestMatchers(WHITE_LIST).permitAll()
                        .requestMatchers("/api/*test/secured").hasRole("ADMIN")
                        .anyRequest().authenticated()

                        //BA05 - Crear el filtro de seguridad y aplicarlo
                ).addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(customInterceptor).addPathPatterns("/api/test/**");
    }

    //Siguiente -> Crear un endpoint/URI/ruta/path para probar la seguridad
}
