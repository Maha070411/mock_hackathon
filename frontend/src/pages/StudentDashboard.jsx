import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, LogOut, Bell, BookOpen, Layers } from 'lucide-react';
import api from '../services/api';
import BookCard from '../components/BookCard';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState(searchParams.get('category') || '');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBorrowBookId, setActiveBorrowBookId] = useState(null);

  useEffect(() => {
    const categoryQuery = searchParams.get('category') || '';
    setDepartmentFilter(categoryQuery);
  }, [searchParams]);

  useEffect(() => {
    fetchBooks();
    fetchNotifications();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books', error);
      // For mock UI, add dummy data if API fails
      setBooks([
        { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', department: 'Computer Science', availableCopies: 5 },
        { id: 2, title: 'Clean Code', author: 'Robert C. Martin', department: 'Computer Science', availableCopies: 2 },
        { id: 3, title: 'Calculus', author: 'James Stewart', department: 'Mathematics', availableCopies: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/transactions/student/view');
      const overdue = response.data.filter(t => t.status === 'OVERDUE');
      setNotifications(overdue);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const distinctDepartments = [...new Set([...books.map(b => b.department), searchParams.get('category')].filter(Boolean))].sort();

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                          book.author.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter ? book.department === departmentFilter : true;
    return matchesSearch && matchesDept;
  }).sort((a, b) => a.title.localeCompare(b.title));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Student Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/student/categories" className="text-gray-500 hover:text-indigo-600 font-medium px-3 py-2 rounded-md text-sm transition-colors flex items-center">
                <Layers className="h-4 w-4 mr-1" /> Categories
              </Link>
              <Link to="/student/my-books" className="text-gray-500 hover:text-indigo-600 font-medium px-3 py-2 rounded-md text-sm transition-colors flex items-center">
                <BookOpen className="h-4 w-4 mr-1" /> My Books
              </Link>
              <div className="text-sm border-l border-gray-200 pl-4 h-8 pt-1 hidden md:block">
                <p className="font-medium text-gray-900 leading-tight">{user?.fullName || 'Student'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {notifications.length > 0 && (
        <div className="bg-red-50 p-4 rounded-md mx-auto max-w-7xl mt-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                You have {notifications.length} overdue book(s). Please return them ASAP!
              </h3>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  if (e.target.value) {
                    searchParams.set('category', e.target.value);
                  } else {
                    searchParams.delete('category');
                  }
                  setSearchParams(searchParams);
                }}
                className="input-field pl-10 bg-white"
              >
                <option value="">All Categories & Depts</option>
                {distinctDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    isExpanded={activeBorrowBookId === book.id}
                    onToggleExpand={() => setActiveBorrowBookId(activeBorrowBookId === book.id ? null : book.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No books found matching your criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
