package com.telusko.SpringEcom.config;

import com.telusko.SpringEcom.service.CustomerUserDetailsService;
import com.telusko.SpringEcom.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomerUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
System.out.println("authorization header: "+ authHeader);
        String token = null;
        String email = null;

        // Check whether request contains:
        // Authorization: Bearer <token>
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            token = authHeader.substring(7);

            try {
                email = jwtService.extractEmail(token);
            } catch (Exception e) {
                // Invalid/expired token
            }
        }

        // If we found an email and nobody is authenticated yet
        if (email != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(email);
            if (jwtService.isTokenValid(token, userDetails)) {
               System.out.println("token valid");
               System.out.println(email);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                     System.out.println("authentication"+ authentication.getName());
                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}