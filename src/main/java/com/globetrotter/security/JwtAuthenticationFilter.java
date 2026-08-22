package com.globetrotter.security;

import com.globetrotter.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        return path.equals("/api/auth/login")
                || path.equals("/api/auth/signup");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println(
                "JWT FILTER: "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI()
        );

        System.out.println("AUTH HEADER: " + authHeader);

        // No Authorization header
        if (authHeader == null || authHeader.isBlank()) {

            System.out.println("NO AUTHORIZATION HEADER");

            filterChain.doFilter(request, response);
            return;
        }

        // Authorization header exists but is not Bearer
        if (!authHeader.startsWith("Bearer ")) {

            System.out.println("INVALID AUTHORIZATION HEADER");

            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT
        String token = authHeader.substring(7).trim();

        // Bearer header exists but token is empty
        if (token.isEmpty()) {

            System.out.println("EMPTY JWT TOKEN");

            SecurityContextHolder.clearContext();

            filterChain.doFilter(request, response);
            return;
        }

        try {

            Claims claims = jwtService.extractClaims(token);

            String email = claims.getSubject();

            if (email == null || email.isBlank()) {

                System.out.println("JWT DOES NOT CONTAIN EMAIL");

                SecurityContextHolder.clearContext();

                filterChain.doFilter(request, response);
                return;
            }

            System.out.println("JWT VALID: " + email);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.emptyList()
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            System.out.println(
                    "SECURITY CONTEXT SET: "
                            + SecurityContextHolder
                            .getContext()
                            .getAuthentication()
            );

        } catch (Exception e) {

            System.out.println(
                    "JWT VALIDATION FAILED: "
                            + e.getClass().getName()
            );

            System.out.println(
                    "JWT ERROR: "
                            + e.getMessage()
            );

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}