package com.library.service;
import com.library.model.Book;
import java.util.List;

public interface BookService {
    List<Book> getAllBooks(String department);
    Book addBook(Book book);
    Book getBookById(Long id);
}
