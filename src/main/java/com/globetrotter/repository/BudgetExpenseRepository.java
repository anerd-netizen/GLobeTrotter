package com.globetrotter.repository;

import com.globetrotter.model.BudgetExpense;
import com.globetrotter.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetExpenseRepository
        extends JpaRepository<BudgetExpense, Long> {

    List<BudgetExpense> findByTripOrderByIdAsc(Trip trip);

    Optional<BudgetExpense> findByIdAndTrip(
            Long id,
            Trip trip
    );
}