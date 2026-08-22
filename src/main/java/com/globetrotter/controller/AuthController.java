package com.globetrotter.controller;

import com.globetrotter.dto.AuthResponse;
import com.globetrotter.model.User;
import com.globetrotter.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> me(Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Unauthorized");
        }

        String email = authentication.getName();

        User user = authService.getUserByEmail(email);

        return ResponseEntity.ok(user);
    }
}