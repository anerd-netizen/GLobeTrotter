package com.globetrotter.repository;

import com.globetrotter.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Long> {

    List<City> findTop20ByNameContainingIgnoreCaseOrCountryContainingIgnoreCase(
            String name,
            String country
    );

    List<City> findByCountryIgnoreCase(String country);

    List<City> findByRegionIgnoreCase(String region);
}
