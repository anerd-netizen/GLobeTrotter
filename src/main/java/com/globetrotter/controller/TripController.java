package com.globetrotter.controller;

import com.globetrotter.model.Trip;
import com.globetrotter.service.TripService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    public Trip createTrip(
            @RequestBody Trip trip,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return tripService.createTrip(trip, email);
    }

    @GetMapping
    public List<Trip> getMyTrips(Authentication authentication) {
        String email = authentication.getName();

        return tripService.getMyTrips(email);
    }
}