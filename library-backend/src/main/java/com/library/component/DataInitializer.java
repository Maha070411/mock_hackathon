package com.library.component;

import com.library.model.Book;
import com.library.model.Role;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.UserRepository;
import com.library.repository.BorrowingRecordRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BorrowingRecordRepository borrowingRecordRepository;

    public DataInitializer(BookRepository bookRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, BorrowingRecordRepository borrowingRecordRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.borrowingRecordRepository = borrowingRecordRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@library.com")) {
            User admin = new User();
            admin.setFullName("Super Admin");
            admin.setEmail("admin@library.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }
        
        if (!userRepository.existsByEmail("student@library.com")) {
            User student = new User();
            student.setFullName("Jane Student");
            student.setEmail("student@library.com");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setRole(Role.STUDENT);
            student.setDepartment("Computer Science");
            userRepository.save(student);
        }

        if (bookRepository.count() <= 10) {
            borrowingRecordRepository.deleteAll(); // Forcefully clean any stuck transactions to prevent FK constraint failure
            bookRepository.deleteAll(); 
            
            String[][] bookData = {
                {"The Bourne Identity", "Robert Ludlum", "Action & Adventure"},
                {"Normal People", "Sally Rooney", "Contemporary Fiction"},
                {"1984", "George Orwell", "Dystopian"},
                {"The Hobbit", "J.R.R. Tolkien", "Fantasy"},
                {"Watchmen", "Alan Moore", "Graphic Novel"},
                {"The Book Thief", "Markus Zusak", "Historical Fiction"},
                {"The Shining", "Stephen King", "Horror"},
                {"To Kill a Mockingbird", "Harper Lee", "Literary Fiction"},
                {"The Girl with the Dragon Tattoo", "Stieg Larsson", "Mystery & Crime"},
                {"Pride and Prejudice", "Jane Austen", "Romance"},
                {"Dune", "Frank Herbert", "Science Fiction"},
                {"Tenth of December", "George Saunders", "Short Story"},
                {"Gone Girl", "Gillian Flynn", "Thriller & Suspense"},
                {"Lonesome Dove", "Larry McMurtry", "Western"},
                {"Little Fires Everywhere", "Celeste Ng", "Women’s Fiction"},
                {"The Story of Art", "E.H. Gombrich", "Art & Photography"},
                {"Steve Jobs", "Walter Isaacson", "Biography & Autobiography"},
                {"Freakonomics", "Steven Levitt", "Business & Economics"},
                {"Mastering the Art of French Cooking", "Julia Child", "Cookbooks, Food & Drink"},
                {"The Artist's Way", "Julia Cameron", "Crafts & Hobbies"},
                {"Atomic Habits", "James Clear", "Health, Fitness & Dieting"},
                {"Sapiens", "Yuval Noah Harari", "History"},
                {"Bossypants", "Tina Fey", "Humor"},
                {"Educated", "Tara Westover", "Memoir"},
                {"Meditations", "Marcus Aurelius", "Philosophy"},
                {"The New Jim Crow", "Michelle Alexander", "Politics & Social Sciences"},
                {"The Elements of Style", "William Strunk", "Reference"},
                {"The Power of Now", "Eckhart Tolle", "Religion & Spirituality"},
                {"A Brief History of Time", "Stephen Hawking", "Science & Technology"},
                {"How to Win Friends", "Dale Carnegie", "Self-Help"},
                {"Into Thin Air", "Jon Krakauer", "Travel"},
                {"In Cold Blood", "Truman Capote", "True Crime"}
            };
            
            List<Book> allBooks = java.util.Arrays.stream(bookData)
                .map(data -> new Book(data[0], data[1], data[2], 5, 5))
                .toList();

            bookRepository.saveAll(allBooks);
        }
    }
}
