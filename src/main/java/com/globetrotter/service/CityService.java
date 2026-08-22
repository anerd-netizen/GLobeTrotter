package com.globetrotter.service;

import com.globetrotter.model.City;
import com.globetrotter.repository.CityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityService {

    private final CityRepository cityRepository;

    public CityService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    public List<City> searchCities(String query) {
        if (query == null || query.trim().isEmpty()) {
            return cityRepository.findAll();
        }

        String search = query.trim();

        return cityRepository
                .findTop20ByNameContainingIgnoreCaseOrCountryContainingIgnoreCase(
                        search,
                        search
                );
    }

    public List<City> getAllCities() {
        return cityRepository.findAll();
    }
}
