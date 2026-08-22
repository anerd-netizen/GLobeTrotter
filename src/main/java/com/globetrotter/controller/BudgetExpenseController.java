package com.globetrotter.controller;

import com.globetrotter.dto.BudgetExpenseResponse;
import com.globetrotter.dto.BudgetSummaryResponse;
import com.globetrotter.model.BudgetExpense;
import com.globetrotter.service.BudgetExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/budget")
public class BudgetExpenseController {

    private final BudgetExpenseService budgetExpenseService;

    public BudgetExpenseController(
            BudgetExpenseService budgetExpenseService
    ) {
        this.budgetExpenseService = budgetExpenseService;
    }

    @PostMapping
    public ResponseEntity<BudgetExpenseResponse> createExpense(
            @PathVariable Long tripId,
            @RequestBody BudgetExpense expense,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                budgetExpenseService.createExpense(
                        tripId,
                        expense,
                        email
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<BudgetExpenseResponse>> getExpenses(
            @PathVariable Long tripId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                budgetExpenseService.getExpenses(
                        tripId,
                        email
                )
        );
    }

    @GetMapping("/summary")
    public ResponseEntity<BudgetSummaryResponse> getSummary(
            @PathVariable Long tripId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                budgetExpenseService.getSummary(
                        tripId,
                        email
                )
        );
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<BudgetExpenseResponse> updateExpense(
            @PathVariable Long tripId,
            @PathVariable Long expenseId,
            @RequestBody BudgetExpense expense,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                budgetExpenseService.updateExpense(
                        tripId,
                        expenseId,
                        expense,
                        email
                )
        );
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long tripId,
            @PathVariable Long expenseId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        budgetExpenseService.deleteExpense(
                tripId,
                expenseId,
                email
        );

        return ResponseEntity.noContent().build();
    }
}