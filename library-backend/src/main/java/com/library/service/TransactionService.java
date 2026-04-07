package com.library.service;
import com.library.payload.Dto;
import java.util.List;

public interface TransactionService {
    void borrowBook(Dto.BorrowRequest request);
    void returnBook(Long id);
    List<Dto.TransactionResponse> viewAllTransactions();
    List<Dto.TransactionResponse> viewStudentTransactions();
    String generateCsvReport();
}
