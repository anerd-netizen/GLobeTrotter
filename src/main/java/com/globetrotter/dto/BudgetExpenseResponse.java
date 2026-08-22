package com.globetrotter.dto;

import java.math.BigDecimal;

public class BudgetExpenseResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal amount;
    private String category;
    private Long tripId;

    public BudgetExpenseResponse(
            Long id,
            String title,
            String description,
            BigDecimal amount,
            String category,
            Long tripId
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.tripId = tripId;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCategory() {
        return category;
    }

    public Long getTripId() {
        return tripId;
    }
}