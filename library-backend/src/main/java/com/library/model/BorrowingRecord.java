package com.library.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "borrowing_records")
public class BorrowingRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id")
    private Book book;

    @CreationTimestamp
    private LocalDateTime borrowDateTime;

    private LocalDateTime expectedReturnDateTime;

    private LocalDateTime actualReturnDateTime;

    @Enumerated(EnumType.STRING)
    private RecordStatus status;
}
