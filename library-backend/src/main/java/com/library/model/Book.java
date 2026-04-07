package com.library.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "books")
public class Book {
    public Book() {}
    public Book(String title, String author, String department, int totalCopies, int availableCopies) {
        this.title = title;
        this.author = author;
        this.department = department;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String department;

    private int totalCopies;
    private int availableCopies;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
