package utez.edu.mx.basicauth.security.interceptors;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
public class CustomInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String ip  = convertirIPv6ToIPv4(request.getRemoteAddr());
        ip= convertirIPv6ToIPv4(ip);

        if(ip.startsWith("192.168")){
            System.out.println("Direccion ip blñoqueada");
            response.sendError(HttpServletResponse.SC_FORBIDDEN,"La direccion IP está blqueada");
            return false;
        } else{
            return true;
        }

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("Cierre del interceptor");
    }

    private String convertirIPv6ToIPv4(String ipv6) {
        try {
            InetAddress inetAddress = InetAddress.getByName(ipv6);
            byte[] addressBytes = inetAddress.getAddress();

            if (addressBytes.length == 4) {
                return inetAddress.getHostAddress();
            }
            if ("0:0:0:0:0:0:0:1".equals(ipv6) || "::1".equals(ipv6)) {
                return "127.0.0.1";
            }
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }

        return ipv6;
    }

}
