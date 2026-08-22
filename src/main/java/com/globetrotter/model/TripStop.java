package com.globetrotter.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "trip_stops")
public class TripStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private Integer stopOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    public TripStop() {
    }

    public TripStop(
            String city,
            LocalDate startDate,
            LocalDate endDate,
            Integer stopOrder,
            Trip trip
    ) {
        this.city = city;
        this.startDate = startDate;
        this.endDate = endDate;
        this.stopOrder = stopOrder;
        this.trip = trip;
    }

    public Long getId() {
        return id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getStopOrder() {
        return stopOrder;
    }

    public void setStopOrder(Integer stopOrder) {
        this.stopOrder = stopOrder;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }
}