package com.globetrotter.repository;

import com.globetrotter.model.Activity;
import com.globetrotter.model.TripStop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByTripStopOrderByActivityDateAsc(TripStop tripStop);

    Optional<Activity> findByIdAndTripStop(Long id, TripStop tripStop);
}
