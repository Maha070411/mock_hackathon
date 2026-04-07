package com.library.payload;

public class Dto {
    public record LoginRequest(String email, String password) {}
    public record RegisterRequest(String fullName, String email, String password, String role, String department) {}
    public record JwtResponse(String token, Long id, String email, String role, String fullName) {}
    public record BorrowRequest(Long bookId, java.time.LocalDateTime expectedReturnDateTime) {}
    public record MessageResponse(String message) {}
    public record TransactionResponse(
        String id,
        String studentName,
        String department,
        String bookName,
        String author,
        java.time.LocalDateTime borrowDateTime,
        java.time.LocalDateTime expectedReturnDateTime,
        java.time.LocalDateTime actualReturnDateTime,
        String status
    ) {}
}
