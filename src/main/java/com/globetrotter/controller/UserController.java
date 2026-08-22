package com.globetrotter.controller;

import com.globetrotter.model.User;
import com.globetrotter.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/{id}")
    public User getUser(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User authenticatedUser = authService.getUserByEmail(
                authentication.getName()
        );

        if (!authenticatedUser.getId().equals(id)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Access denied"
            );
        }

        return authenticatedUser;
    }
}