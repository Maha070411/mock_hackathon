package com.library.controller;

import com.library.payload.Dto;
import com.library.service.TransactionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/borrow")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> borrowBook(@RequestBody Dto.BorrowRequest request) {
        try {
            transactionService.borrowBook(request);
            return ResponseEntity.ok(new Dto.MessageResponse("Book borrowed successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Dto.MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/return/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> returnBook(@PathVariable String id) {
        try {
            Long parsedId = Long.parseLong(id.replace("TRX-", ""));
            transactionService.returnBook(parsedId);
            return ResponseEntity.ok(new Dto.MessageResponse("Book returned successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Dto.MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/admin/view")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Dto.TransactionResponse> viewAllTransactions() {
        return transactionService.viewAllTransactions();
    }

    @GetMapping("/student/view")
    @PreAuthorize("hasRole('STUDENT')")
    public List<Dto.TransactionResponse> viewStudentTransactions() {
        return transactionService.viewStudentTransactions();
    }

    @GetMapping("/admin/report/download")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> downloadReport() {
        String csvData = transactionService.generateCsvReport();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"report.csv\"")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(csvData);
    }
}
