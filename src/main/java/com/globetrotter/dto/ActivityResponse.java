package com.globetrotter.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ActivityResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal cost;
    private Integer durationMinutes;
    private LocalDate activityDate;
    private Long tripStopId;

    public ActivityResponse() {
    }

    public ActivityResponse(
            Long id,
            String name,
            String description,
            BigDecimal cost,
            Integer durationMinutes,
            LocalDate activityDate,
            Long tripStopId
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.durationMinutes = durationMinutes;
        this.activityDate = activityDate;
        this.tripStopId = tripStopId;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public Long getTripStopId() {
        return tripStopId;
    }
}