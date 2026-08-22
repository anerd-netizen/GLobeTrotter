package com.globetrotter.controller;

import com.globetrotter.dto.TripStopResponse;
import com.globetrotter.model.TripStop;
import com.globetrotter.service.TripStopService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/stops")
public class TripStopController {

    private final TripStopService tripStopService;

    public TripStopController(TripStopService tripStopService) {
        this.tripStopService = tripStopService;
    }

    @PostMapping
    public ResponseEntity<TripStopResponse> createStop(
            @PathVariable Long tripId,
            @RequestBody TripStop stop,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                tripStopService.createStop(tripId, stop, email)
        );
    }

    @GetMapping
    public ResponseEntity<List<TripStopResponse>> getTripStops(
            @PathVariable Long tripId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                tripStopService.getTripStops(tripId, email)
        );
    }

    @PutMapping("/{stopId}")
    public ResponseEntity<TripStopResponse> updateStop(
            @PathVariable Long tripId,
            @PathVariable Long stopId,
            @RequestBody TripStop updatedStop,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                tripStopService.updateStop(
                        tripId,
                        stopId,
                        updatedStop,
                        email
                )
        );
    }

    @DeleteMapping("/{stopId}")
    public ResponseEntity<Void> deleteStop(
            @PathVariable Long tripId,
            @PathVariable Long stopId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        tripStopService.deleteStop(
                tripId,
                stopId,
                email
        );

        return ResponseEntity.noContent().build();
    }
}