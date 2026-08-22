package com.globetrotter.controller;

import com.globetrotter.model.City;
import com.globetrotter.service.CityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "http://localhost:5173")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<City>> searchCities(
            @RequestParam(required = false) String q
    ) {
        return ResponseEntity.ok(cityService.searchCities(q));
    }

    @GetMapping
    public ResponseEntity<List<City>> getAllCities() {
        return ResponseEntity.ok(cityService.getAllCities());
    }
}
