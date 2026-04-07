import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, BookOpen, Layers, Search, RefreshCw, Download, AlertTriangle } from 'lucide-react';

const MyBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions/student/view');
      setBorrowedBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch borrowed books', error);
      // Fallback dummy data if no mock/api is present
      setBorrowedBooks([
        { id: '1', bookName: 'Sample Book', author: 'Sample Author', borrowDateTime: new Date().toISOString(), expectedReturnDateTime: new Date().toISOString(), actualReturnDateTime: null, status: 'PENDING' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (transactionId) => {
    try {
      setProcessingId(transactionId);
      await api.put(`/transactions/return/${transactionId}`);
      // Refresh the list after successful return
      await fetchMyBooks();
    } catch (error) {
      console.error('Failed to return book', error);
      alert('Could not return the book. Try again later.');
    } finally {
      setProcessingId(null);
    }
  };

  const exportToCSV = () => {
    if (borrowedBooks.length === 0) return;
    const headers = ['Book Name', 'Author', 'Borrow Date', 'Expected Return', 'Actual Return', 'Status'];
    const rows = borrowedBooks.map(b => [
      `"${b.bookName}"`,
      `"${b.author || 'Unknown'}"`,
      new Date(b.borrowDateTime).toLocaleString(),
      new Date(b.expectedReturnDateTime).toLocaleString(),
      b.actualReturnDateTime ? new Date(b.actualReturnDateTime).toLocaleString() : 'N/A',
      b.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_borrowing_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBooks = borrowedBooks.filter(b => 
    b.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.author && b.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'RETURNED': return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-green-50 text-green-800 border-green-200">RETURNED</span>;
      case 'PENDING': return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-yellow-50 text-yellow-800 border-yellow-200">PENDING</span>;
      case 'OVERDUE': return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-red-50 text-red-800 border-red-200">OVERDUE</span>;
      default: return <span>{status}</span>;
    }
  };

  const getRowClass = (status) => {
    switch(status) {
      case 'RETURNED': return 'bg-green-50/20';
      case 'PENDING': return 'bg-yellow-50/20';
      case 'OVERDUE': return 'bg-red-50/20';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/student" className="flex items-center text-indigo-600 hover:text-indigo-800">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-500 mr-3" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Books</h1>
          </div>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Download className="h-4 w-4 mr-2" />
            Export History
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 sm:mb-0">Borrowing History</h3>
            <div className="relative rounded-md shadow-sm max-w-md w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="input-field pl-10 sm:text-sm"
                placeholder="Search books or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Borrow Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Expected Return</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
                    </td>
                  </tr>
                ) : filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No books found in your history.</td>
                  </tr>
                ) : (
                  filteredBooks.map((tx) => {
                    const isOverdue = tx.status === 'OVERDUE' || (tx.status === 'PENDING' && new Date() > new Date(tx.expectedReturnDateTime));
                    const displayStatus = isOverdue && tx.status !== 'RETURNED' ? 'OVERDUE' : tx.status;
                    
                    return (
                      <tr key={tx.id} className={`${getRowClass(displayStatus)} hover:bg-gray-50 transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{tx.bookName}</div>
                          {displayStatus === 'OVERDUE' && (
                            <div className="text-xs text-red-600 flex items-center mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" /> Book is overdue
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.author || 'Unknown'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell" title={new Date(tx.borrowDateTime).toLocaleString()}>
                          {new Date(tx.borrowDateTime).toLocaleDateString()}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell ${displayStatus === 'OVERDUE' ? 'text-red-600 font-medium' : 'text-gray-500'}`} title={new Date(tx.expectedReturnDateTime).toLocaleString()}>
                          {new Date(tx.expectedReturnDateTime).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(displayStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {displayStatus !== 'RETURNED' ? (
                            <button
                              onClick={() => handleReturnBook(tx.id)}
                              disabled={processingId === tx.id}
                              className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors disabled:opacity-50 inline-flex items-center"
                            >
                              {processingId === tx.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Return Book'}
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs inline-flex items-center" title={tx.actualReturnDateTime ? new Date(tx.actualReturnDateTime).toLocaleString() : ''}>
                              Returned on {tx.actualReturnDateTime ? new Date(tx.actualReturnDateTime).toLocaleDateString() : 'N/A'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyBooks;
