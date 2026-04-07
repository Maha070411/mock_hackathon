import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, LogOut, BookOpen, PlusSquare, List, Edit, Trash2, ArrowUpDown, AlertCircle } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      // Fulfilling API query param requirements
      const response = await api.get('/books', {
        params: { search: searchTerm, department: categoryFilter }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        // Mocking the delete locally to update UI
        setBooks(books.filter(b => b.id !== id));
        alert('Book deleted successfully');
      } catch (error) {
        alert('Error deleting book');
      }
    }
  };

  // Local filtering & sorting logic (handles mock data bypassing search params)
  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            book.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? book.department === categoryFilter : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const distinctCategories = [...new Set(books.map(b => b.department).filter(Boolean))].sort();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Admin Portal</span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/admin" className="text-gray-900 border-b-2 border-indigo-600 font-medium px-3 py-2 text-sm flex items-center">
                <BookOpen className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Home</span>
              </Link>
              <Link to="/admin/add-book" className="text-gray-500 hover:text-indigo-600 font-medium px-3 py-2 text-sm transition-colors flex items-center">
                <PlusSquare className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Add Book</span>
              </Link>
              <Link to="/admin/transactions" className="text-gray-500 hover:text-indigo-600 font-medium px-3 py-2 text-sm transition-colors flex items-center">
                <List className="h-4 w-4 mr-1" /> <span className="hidden md:inline">Transactions</span>
              </Link>
              
              <div className="text-sm border-l border-gray-200 pl-4 h-8 pt-1 hidden md:block">
                <p className="font-medium text-gray-900">{user?.fullName || 'Admin User'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none ml-2"
              >
                <LogOut className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Library Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredAndSortedBooks.length} Total Books Available
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/admin/add-book')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            <PlusSquare className="mr-2 h-5 w-5" />
            Add New Book
          </button>
        </div>

        <div className="bg-white p-4 shadow sm:rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search by Title or Author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="input-field pl-10 bg-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {distinctCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ArrowUpDown className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="input-field pl-10 bg-white"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Sort A–Z</option>
                <option value="desc">Sort Z–A</option>
              </select>
            </div>

          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedBooks.length > 0 ? (
              filteredAndSortedBooks.map((book) => {
                const lowStock = book.availableCopies < 2;
                // Since totalCopies isn't tracked robustly in mock we deduce it, or default to 5
                const totalCopies = book.totalCopies || book.availableCopies + 2; 

                return (
                  <div key={book.id} className="bg-white overflow-hidden shadow-sm flex flex-col rounded-lg border border-gray-200 hover:shadow-md transition-shadow relative">
                    {lowStock && (
                      <div className="absolute top-0 right-0 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-bl-lg border-b border-l border-red-200 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" /> Low Stock
                      </div>
                    )}
                    
                    <div className="px-4 pt-5 pb-3 flex-1">
                      <h3 className="text-lg leading-6 font-semibold text-gray-900 pr-5" title={book.title}>
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">by {book.author || 'Unknown'}</p>
                      
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {book.department}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 flex justify-between items-center text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Inventory</span>
                        <span className={`font-semibold ${lowStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {book.availableCopies} / {totalCopies} Available
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => alert('Edit feature not mocked')}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit Book"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(book.id, book.title)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
                <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search filters or <Link to="/admin/add-book" className="text-indigo-600 hover:text-indigo-500">add a new book.</Link>
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
