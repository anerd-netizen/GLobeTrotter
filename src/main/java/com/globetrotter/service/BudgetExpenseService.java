package com.globetrotter.service;

import com.globetrotter.dto.BudgetExpenseResponse;
import com.globetrotter.dto.BudgetSummaryResponse;
import com.globetrotter.model.BudgetExpense;
import com.globetrotter.model.Trip;
import com.globetrotter.model.User;
import com.globetrotter.repository.BudgetExpenseRepository;
import com.globetrotter.repository.TripRepository;
import com.globetrotter.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class BudgetExpenseService {

    private final BudgetExpenseRepository budgetExpenseRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public BudgetExpenseService(
            BudgetExpenseRepository budgetExpenseRepository,
            TripRepository tripRepository,
            UserRepository userRepository
    ) {
        this.budgetExpenseRepository = budgetExpenseRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    public BudgetExpenseResponse createExpense(
            Long tripId,
            BudgetExpense expense,
            String email
    ) {
        User user = getUser(email);

        Trip trip = getTrip(tripId, user);

        if (expense.getTitle() == null || expense.getTitle().isBlank()) {
            throw new RuntimeException("Expense title is required");
        }

        if (expense.getAmount() == null ||
                expense.getAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Expense amount must be valid");
        }

        if (expense.getCategory() == null ||
                expense.getCategory().isBlank()) {
            throw new RuntimeException("Expense category is required");
        }

        expense.setTrip(trip);

        BudgetExpense saved =
                budgetExpenseRepository.save(expense);

        return toResponse(saved);
    }

    public List<BudgetExpenseResponse> getExpenses(
            Long tripId,
            String email
    ) {
        User user = getUser(email);

        Trip trip = getTrip(tripId, user);

        return budgetExpenseRepository
                .findByTripOrderByIdAsc(trip)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public BudgetExpenseResponse updateExpense(
            Long tripId,
            Long expenseId,
            BudgetExpense updatedExpense,
            String email
    ) {
        User user = getUser(email);

        Trip trip = getTrip(tripId, user);

        BudgetExpense expense =
                budgetExpenseRepository
                        .findByIdAndTrip(expenseId, trip)
                        .orElseThrow(() ->
                                new RuntimeException("Expense not found")
                        );

        if (updatedExpense.getTitle() == null ||
                updatedExpense.getTitle().isBlank()) {
            throw new RuntimeException("Expense title is required");
        }

        if (updatedExpense.getAmount() == null ||
                updatedExpense.getAmount()
                        .compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException(
                    "Expense amount must be valid"
            );
        }

        if (updatedExpense.getCategory() == null ||
                updatedExpense.getCategory().isBlank()) {
            throw new RuntimeException(
                    "Expense category is required"
            );
        }

        expense.setTitle(updatedExpense.getTitle());
        expense.setDescription(updatedExpense.getDescription());
        expense.setAmount(updatedExpense.getAmount());
        expense.setCategory(updatedExpense.getCategory());

        BudgetExpense saved =
                budgetExpenseRepository.save(expense);

        return toResponse(saved);
    }

    public void deleteExpense(
            Long tripId,
            Long expenseId,
            String email
    ) {
        User user = getUser(email);

        Trip trip = getTrip(tripId, user);

        BudgetExpense expense =
                budgetExpenseRepository
                        .findByIdAndTrip(expenseId, trip)
                        .orElseThrow(() ->
                                new RuntimeException("Expense not found")
                        );

        budgetExpenseRepository.delete(expense);
    }

    public BudgetSummaryResponse getSummary(
            Long tripId,
            String email
    ) {
        User user = getUser(email);

        Trip trip = getTrip(tripId, user);

        List<BudgetExpense> expenses =
                budgetExpenseRepository.findByTripOrderByIdAsc(trip);

        BigDecimal total = BigDecimal.ZERO;

        Map<String, BigDecimal> breakdown =
                new LinkedHashMap<>();

        breakdown.put("Transport", BigDecimal.ZERO);
        breakdown.put("Accommodation", BigDecimal.ZERO);
        breakdown.put("Activities", BigDecimal.ZERO);
        breakdown.put("Meals", BigDecimal.ZERO);
        breakdown.put("Other", BigDecimal.ZERO);

        for (BudgetExpense expense : expenses) {

            BigDecimal amount = expense.getAmount();

            total = total.add(amount);

            String category = expense.getCategory();

            breakdown.put(
                    category,
                    breakdown.getOrDefault(
                            category,
                            BigDecimal.ZERO
                    ).add(amount)
            );
        }

        return new BudgetSummaryResponse(
                total,
                breakdown
        );
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }

    private Trip getTrip(Long tripId, User user) {
        return tripRepository
                .findByIdAndUser(tripId, user)
                .orElseThrow(() ->
                        new RuntimeException("Trip not found")
                );
    }

    private BudgetExpenseResponse toResponse(
            BudgetExpense expense
    ) {
        return new BudgetExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getTrip().getId()
        );
    }
}