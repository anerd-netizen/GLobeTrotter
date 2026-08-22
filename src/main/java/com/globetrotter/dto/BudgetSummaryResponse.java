package com.globetrotter.dto;

import java.math.BigDecimal;
import java.util.Map;

public class BudgetSummaryResponse {

    private BigDecimal total;
    private Map<String, BigDecimal> breakdown;

    public BudgetSummaryResponse(
            BigDecimal total,
            Map<String, BigDecimal> breakdown
    ) {
        this.total = total;
        this.breakdown = breakdown;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public Map<String, BigDecimal> getBreakdown() {
        return breakdown;
    }
}