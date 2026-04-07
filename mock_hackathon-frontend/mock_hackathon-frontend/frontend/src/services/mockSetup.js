import MockAdapter from 'axios-mock-adapter';
import api from './api';

// Create mock instance on our existing axios instance
const mock = new MockAdapter(api, { delayResponse: 500 });

// Helper to create fake JWT tokens via mocked Base64 payloads
const createMockToken = (userObj) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    ...userObj,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // valid for 1 hour
  }));
  return `${header}.${payload}.signature`;
};

// 1. Mock Login Endpoint -> POST /auth/login
mock.onPost('/auth/login').reply((config) => {
  const { email, password } = JSON.parse(config.data);
  
  if (email === 'admin@library.com' && password === 'password123') {
    return [200, { token: createMockToken({ sub: email, role: 'ADMIN', fullName: 'System Admin' }) }];
  }
  
  if (email === 'student@library.com' && password === 'password123') {
    return [200, { token: createMockToken({ sub: email, role: 'STUDENT', fullName: 'John Doe', department: 'Computer Science' }) }];
  }

  return [401, { message: 'Invalid credentials. Try admin@library.com or student@library.com with password123' }];
});

// 2. Mock Register Endpoint -> POST /auth/register
mock.onPost('/auth/register').reply(201, { message: 'Registration successful' });

// In-Memory Database for Books and Transactions
let books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', department: 'Computer Science', availableCopies: 5, description: 'Best practices in software dev.' },
  { id: 2, title: 'Calculus: Early Transcendentals', author: 'James Stewart', department: 'Mathematics', availableCopies: 0, description: 'Calculus foundations.' },
  { id: 3, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', department: 'Computer Science', availableCopies: 2, description: 'Standard algorithms book.' },
];

let transactions = [
  { id: 'TRX-1001', studentName: 'Jane Smith', department: 'Mathematics', bookName: 'Calculus', author: 'James Stewart', borrowDateTime: '2024-03-20T10:00:00', expectedReturnDateTime: '2024-04-03T10:00:00', actualReturnDateTime: null, status: 'PENDING' },
  { id: 'TRX-1002', studentName: 'John Doe', department: 'Computer Science', bookName: 'Clean Code', author: 'Robert C. Martin', borrowDateTime: '2024-02-01T10:00:00', expectedReturnDateTime: '2024-02-15T10:00:00', actualReturnDateTime: null, status: 'OVERDUE' },
];

// 3. Mock View Books -> GET /books
mock.onGet('/books').reply(() => [200, books]);

// 4. Mock Get Single Book -> GET /books/{id}
mock.onGet(/\/books\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const book = books.find(b => b.id === id);
  return book ? [200, book] : [404, { message: 'Book not found' }];
});

// 5. Mock Add Book -> POST /books/add
mock.onPost('/books/add').reply((config) => {
  const newBook = JSON.parse(config.data);
  newBook.id = books.length + 1;
  books.push(newBook);
  return [201, newBook];
});

// 6. Mock Borrow Book -> POST /transactions/borrow
mock.onPost('/transactions/borrow').reply((config) => {
  const data = JSON.parse(config.data);
  const book = books.find(b => b.id === data.bookId);
  
  if (book && book.availableCopies > 0) {
    book.availableCopies -= 1;
    transactions.push({
      id: `TRX-${1000 + transactions.length + 1}`,
      studentName: 'John Doe', // Simulating currently logged in user
      department: 'Computer Science',
      bookName: book.title,
      author: book.author,
      borrowDateTime: new Date().toISOString(),
      expectedReturnDateTime: data.expectedReturnDateTime,
      actualReturnDateTime: null,
      status: 'PENDING'
    });
    return [200, { message: 'Book borrowed' }];
  }
  return [400, { message: 'Book not available' }];
});

// 7. Mock Admin View Transactions -> GET /transactions/admin/view
mock.onGet('/transactions/admin/view').reply(() => [200, transactions]);

// 8. Mock Student View Transactions -> GET /transactions/student/view
// (Used for finding notifications like OVERDUE books)
mock.onGet('/transactions/student/view').reply(() => [200, transactions.filter(t => t.studentName === 'John Doe')]);

// 9. Mock Download CSV -> GET /transactions/admin/report/download
mock.onGet('/transactions/admin/report/download').reply(() => [200, "ID,Student,Book,Status\nTRX-1001,Jane Smith,Calculus,PENDING", { 'Content-Type': 'text/csv' }]);

// 10. Mock Return Book -> PUT /transactions/return/:id
mock.onPut(/\/transactions\/return\/.+/).reply((config) => {
  const id = config.url.split('/').pop();
  const tx = transactions.find(t => t.id === id);
  if (tx && tx.status !== 'RETURNED') {
    tx.status = 'RETURNED';
    tx.actualReturnDateTime = new Date().toISOString();
    const book = books.find(b => b.title === tx.bookName);
    if (book) book.availableCopies += 1;
    return [200, tx];
  }
  return [400, { message: 'Invalid transaction' }];
});

console.log('✅ Mock API Server Initialized! Running without backend.');
