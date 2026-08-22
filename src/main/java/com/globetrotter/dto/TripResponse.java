package com.globetrotter.dto;

import java.time.LocalDate;

public class TripResponse {

    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;

    public TripResponse() {
    }

    public TripResponse(
            Long id,
            String name,
            LocalDate startDate,
            LocalDate endDate,
            String description
    ) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getDescription() {
        return description;
    }
}