package utez.edu.mx.basicauth.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import utez.edu.mx.basicauth.modules.auth.User;
import utez.edu.mx.basicauth.modules.auth.UserRepository;
import utez.edu.mx.basicauth.security.MainSecurity;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class AuthFilter extends OncePerRequestFilter {
    @Autowired
    private UserRepository userRepository;

    Set<String> whiteList = Arrays.stream(MainSecurity.getWHITE_LIST()).collect(Collectors.toSet());

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
       final String AUTH_HEADER  = request.getHeader("Authorization");
       String token;
       User user = null;

       if(!whiteList.contains(request.getRequestURI())) {
           if (AUTH_HEADER != null && AUTH_HEADER.startsWith("Bearer ")) {
               token = AUTH_HEADER.substring(7);
               user = userRepository.findByUsername(token.split("\\.")[1]);

               if (user != null && token != null) {
                   List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_"+user.getRol()));
                   UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);

                   SecurityContextHolder.getContext().setAuthentication(authToken);
               } else {
                   response.sendError(HttpServletResponse.SC_NOT_FOUND, "El usuario no existe");
                   return;
               }
           } else {
               response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No tienes autorización");
               return;
           }
       } else {
           System.out.printf("%s: %s\n", request.getRequestURI(), AUTH_HEADER);
           System.out.println("El filtro se ejecutó en modo bypass");
       }

       filterChain.doFilter(request, response);

    }
}
