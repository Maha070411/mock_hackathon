package com.library.service;

import com.library.model.Book;
import com.library.model.BorrowingRecord;
import com.library.model.RecordStatus;
import com.library.model.User;
import com.library.payload.Dto;
import com.library.repository.BookRepository;
import com.library.repository.BorrowingRecordRepository;
import com.library.repository.UserRepository;
import com.library.security.UserDetailsImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {
    private final BorrowingRecordRepository recordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public TransactionServiceImpl(BorrowingRecordRepository recordRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.recordRepository = recordRepository; this.bookRepository = bookRepository; this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void borrowBook(Dto.BorrowRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User student = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Student missing"));
        Book book = bookRepository.findById(request.bookId()).orElseThrow(() -> new RuntimeException("Book missing"));

        if (book.getAvailableCopies() <= 0) throw new RuntimeException("No copies available");

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BorrowingRecord record = new BorrowingRecord();
        record.setStudent(student);
        record.setBook(book);
        record.setExpectedReturnDateTime(request.expectedReturnDateTime());
        record.setStatus(RecordStatus.PENDING);
        recordRepository.save(record);
    }

    @Override
    @Transactional
    public void returnBook(Long id) {
        BorrowingRecord record = recordRepository.findById(id).orElseThrow(() -> new RuntimeException("Record missing"));
        if(record.getStatus() == RecordStatus.RETURNED) throw new RuntimeException("Already returned");
        
        record.setActualReturnDateTime(LocalDateTime.now());
        record.setStatus(RecordStatus.RETURNED);
        recordRepository.save(record);

        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
    }

    @Override
    public List<Dto.TransactionResponse> viewAllTransactions() {
        return recordRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<Dto.TransactionResponse> viewStudentTransactions() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return recordRepository.findAll().stream()
                .filter(t -> t.getStudent().getId().equals(userDetails.getId()))
                .map(this::mapToResponse).toList();
    }

    private Dto.TransactionResponse mapToResponse(BorrowingRecord t) {
        return new Dto.TransactionResponse(
            "TRX-" + t.getId(),
            t.getStudent().getFullName(),
            t.getStudent().getDepartment(),
            t.getBook().getTitle(),
            t.getBook().getAuthor(),
            t.getBorrowDateTime(),
            t.getExpectedReturnDateTime(),
            t.getActualReturnDateTime(),
            t.getStatus().name()
        );
    }

    @Override
    public String generateCsvReport() {
        StringBuilder csv = new StringBuilder("ID,StudentName,Department,BookName,Author,BorrowDate,ExpectedReturnDate,ActualReturnDate,Status\n");
        for (Dto.TransactionResponse t : viewAllTransactions()) {
            csv.append(String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s\n",
                t.id(), t.studentName(), t.department(), t.bookName(), t.author(),
                t.borrowDateTime(), t.expectedReturnDateTime(),
                t.actualReturnDateTime() != null ? t.actualReturnDateTime() : "N/A",
                t.status()
            ));
        }
        return csv.toString();
    }
}
