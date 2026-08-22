package com.globetrotter.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private BigDecimal cost;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Column(nullable = false)
    private LocalDate activityDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_stop_id", nullable = false)
    private TripStop tripStop;

    public Activity() {
    }

    public Activity(
            String name,
            String description,
            BigDecimal cost,
            Integer durationMinutes,
            LocalDate activityDate,
            TripStop tripStop
    ) {
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.durationMinutes = durationMinutes;
        this.activityDate = activityDate;
        this.tripStop = tripStop;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public TripStop getTripStop() {
        return tripStop;
    }

    public void setTripStop(TripStop tripStop) {
        this.tripStop = tripStop;
    }
}