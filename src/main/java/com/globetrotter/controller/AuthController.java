package com.globetrotter.controller;

import com.globetrotter.dto.AuthResponse;
import com.globetrotter.model.User;
import com.globetrotter.service.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody User user) {
        return authService.signup(user);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestParam String email,
            @RequestParam String password
    ) {
        return authService.login(email, password);
    }

    @GetMapping("/me")
    public User me(Authentication authentication) {
        String email = authentication.getName();
        return authService.getUserByEmail(email);
    }
}