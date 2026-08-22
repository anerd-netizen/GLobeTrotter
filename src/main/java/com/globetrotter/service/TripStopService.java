package com.globetrotter.service;

import com.globetrotter.dto.TripStopResponse;
import com.globetrotter.model.Trip;
import com.globetrotter.model.TripStop;
import com.globetrotter.model.User;
import com.globetrotter.repository.TripRepository;
import com.globetrotter.repository.TripStopRepository;
import com.globetrotter.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripStopService {

    private final TripStopRepository tripStopRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripStopService(
            TripStopRepository tripStopRepository,
            TripRepository tripRepository,
            UserRepository userRepository
    ) {
        this.tripStopRepository = tripStopRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    public TripStopResponse createStop(
            Long tripId,
            TripStop stop,
            String email
    ) {
        User user = getUser(email);

        Trip trip = tripRepository.findByIdAndUser(tripId, user)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        stop.setTrip(trip);

        if (stop.getStopOrder() == null) {
            int nextOrder = tripStopRepository
                    .findByTripOrderByStopOrderAsc(trip)
                    .size();

            stop.setStopOrder(nextOrder);
        }

        TripStop savedStop = tripStopRepository.save(stop);

        return toResponse(savedStop);
    }

    public List<TripStopResponse> getTripStops(
            Long tripId,
            String email
    ) {
        User user = getUser(email);

        Trip trip = tripRepository.findByIdAndUser(tripId, user)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        return tripStopRepository
                .findByTripOrderByStopOrderAsc(trip)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TripStopResponse updateStop(
            Long tripId,
            Long stopId,
            TripStop updatedStop,
            String email
    ) {
        User user = getUser(email);

        Trip trip = tripRepository.findByIdAndUser(tripId, user)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        TripStop stop = tripStopRepository
                .findByIdAndTrip(stopId, trip)
                .orElseThrow(() -> new RuntimeException("Trip stop not found"));

        stop.setCity(updatedStop.getCity());
        stop.setStartDate(updatedStop.getStartDate());
        stop.setEndDate(updatedStop.getEndDate());
        stop.setStopOrder(updatedStop.getStopOrder());

        TripStop savedStop = tripStopRepository.save(stop);

        return toResponse(savedStop);
    }

    public void deleteStop(
            Long tripId,
            Long stopId,
            String email
    ) {
        User user = getUser(email);

        Trip trip = tripRepository.findByIdAndUser(tripId, user)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        TripStop stop = tripStopRepository
                .findByIdAndTrip(stopId, trip)
                .orElseThrow(() -> new RuntimeException("Trip stop not found"));

        tripStopRepository.delete(stop);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TripStopResponse toResponse(TripStop stop) {
        return new TripStopResponse(
                stop.getId(),
                stop.getCity(),
                stop.getStartDate(),
                stop.getEndDate(),
                stop.getStopOrder()
        );
    }
}