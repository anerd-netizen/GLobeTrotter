package com.globetrotter.dto;

import java.time.LocalDate;

public class TripStopResponse {

    private Long id;
    private String city;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer stopOrder;

    public TripStopResponse() {
    }

    public TripStopResponse(
            Long id,
            String city,
            LocalDate startDate,
            LocalDate endDate,
            Integer stopOrder
    ) {
        this.id = id;
        this.city = city;
        this.startDate = startDate;
        this.endDate = endDate;
        this.stopOrder = stopOrder;
    }

    public Long getId() {
        return id;
    }

    public String getCity() {
        return city;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public Integer getStopOrder() {
        return stopOrder;
    }
}