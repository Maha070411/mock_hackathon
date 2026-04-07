package com.library.controller;

import com.library.model.Book;
import com.library.service.BookService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {
    private final BookService bookService;
    public BookController(BookService bookService) { this.bookService = bookService; }

    @GetMapping
    public List<Book> getAllBooks(@RequestParam(required = false) String department) {
        return bookService.getAllBooks(department);
    }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> getBookById(@PathVariable Long id) {
        try {
            return org.springframework.http.ResponseEntity.ok(bookService.getBookById(id));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);
    }
}
