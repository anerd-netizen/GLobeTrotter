package com.globetrotter.repository;

import com.globetrotter.model.Trip;
import com.globetrotter.model.TripStop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TripStopRepository extends JpaRepository<TripStop, Long> {

    List<TripStop> findByTripOrderByStopOrderAsc(Trip trip);

    Optional<TripStop> findByIdAndTrip(Long id, Trip trip);
}