package com.globetrotter.config;

import com.globetrotter.model.City;
import com.globetrotter.repository.CityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CityDataSeeder {

    @Bean
    CommandLineRunner seedCities(CityRepository cityRepository) {

        return args -> {

            if (cityRepository.count() > 0) {
                return;
            }

            cityRepository.save(new City(
                    "Goa",
                    "India",
                    "Asia",
                    35.0,
                    95,
                    null
            ));

            cityRepository.save(new City(
                    "Mumbai",
                    "India",
                    "Asia",
                    55.0,
                    92,
                    null
            ));

            cityRepository.save(new City(
                    "Delhi",
                    "India",
                    "Asia",
                    45.0,
                    90,
                    null
            ));

            cityRepository.save(new City(
                    "Dubai",
                    "UAE",
                    "Middle East",
                    80.0,
                    98,
                    null
            ));

            cityRepository.save(new City(
                    "Paris",
                    "France",
                    "Europe",
                    85.0,
                    99,
                    null
            ));

            cityRepository.save(new City(
                    "London",
                    "United Kingdom",
                    "Europe",
                    90.0,
                    98,
                    null
            ));

            cityRepository.save(new City(
                    "Rome",
                    "Italy",
                    "Europe",
                    70.0,
                    95,
                    null
            ));

            cityRepository.save(new City(
                    "Barcelona",
                    "Spain",
                    "Europe",
                    68.0,
                    94,
                    null
            ));

            cityRepository.save(new City(
                    "Tokyo",
                    "Japan",
                    "Asia",
                    88.0,
                    97,
                    null
            ));

            cityRepository.save(new City(
                    "Singapore",
                    "Singapore",
                    "Asia",
                    82.0,
                    96,
                    null
            ));

            cityRepository.save(new City(
                    "Bangkok",
                    "Thailand",
                    "Asia",
                    40.0,
                    94,
                    null
            ));

            cityRepository.save(new City(
                    "Bali",
                    "Indonesia",
                    "Asia",
                    42.0,
                    96,
                    null
            ));

            cityRepository.save(new City(
                    "New York",
                    "United States",
                    "North America",
                    95.0,
                    99,
                    null
            ));

            cityRepository.save(new City(
                    "Los Angeles",
                    "United States",
                    "North America",
                    90.0,
                    95,
                    null
            ));

            cityRepository.save(new City(
                    "Sydney",
                    "Australia",
                    "Oceania",
                    88.0,
                    94,
                    null
            ));

            System.out.println("City seed data loaded.");
        };
    }
}
