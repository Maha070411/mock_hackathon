package com.library.service;

import com.library.model.Book;
import com.library.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookServiceImplTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookServiceImpl bookService;

    private Book testBook1;
    private Book testBook2;

    @BeforeEach
    void setUp() {
        testBook1 = new Book("Head First Java", "Kathy Sierra", "Computer Science", 5, 5);
        testBook1.setId(1L);

        testBook2 = new Book("Design Patterns", "Gang of Four", "Computer Science", 3, 3);
        testBook2.setId(2L);
    }

    @Test
    void getAllBooks_WithoutDepartment_ReturnsAllBooks() {
        when(bookRepository.findAll()).thenReturn(Arrays.asList(testBook1, testBook2));

        List<Book> result = bookService.getAllBooks(null);

        assertEquals(2, result.size());
        verify(bookRepository, times(1)).findAll();
        verify(bookRepository, never()).findByDepartment(anyString());
    }

    @Test
    void getAllBooks_WithEmptyDepartment_ReturnsAllBooks() {
        when(bookRepository.findAll()).thenReturn(Arrays.asList(testBook1, testBook2));

        List<Book> result = bookService.getAllBooks("");

        assertEquals(2, result.size());
        verify(bookRepository, times(1)).findAll();
    }

    @Test
    void getAllBooks_WithDepartment_ReturnsFilteredBooks() {
        when(bookRepository.findByDepartment("Computer Science")).thenReturn(Arrays.asList(testBook1, testBook2));

        List<Book> result = bookService.getAllBooks("Computer Science");

        assertEquals(2, result.size());
        verify(bookRepository, times(1)).findByDepartment("Computer Science");
        verify(bookRepository, never()).findAll();
    }

    @Test
    void addBook_SavesAndReturnsBook() {
        when(bookRepository.save(any(Book.class))).thenReturn(testBook1);

        Book result = bookService.addBook(testBook1);

        assertNotNull(result);
        assertEquals("Head First Java", result.getTitle());
        verify(bookRepository, times(1)).save(testBook1);
    }

    @Test
    void getBookById_ExistingId_ReturnsBook() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook1));

        Book result = bookService.getBookById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Head First Java", result.getTitle());
    }

    @Test
    void getBookById_NonExistingId_ThrowsException() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bookService.getBookById(99L);
        });

        assertEquals("Book not found", exception.getMessage());
    }
}
