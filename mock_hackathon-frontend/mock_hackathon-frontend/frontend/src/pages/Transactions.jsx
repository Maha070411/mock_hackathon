import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Download, Search } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions/admin/view');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      // Mock data for UI presentation
      setTransactions([
        { id: 'TRX-1001', studentName: 'John Doe', department: 'Computer Science', bookName: 'Clean Code', borrowDateTime: '2023-10-10T10:00', expectedReturnDateTime: '2023-10-24T10:00', status: 'RETURNED' },
        { id: 'TRX-1002', studentName: 'Jane Smith', department: 'Mathematics', bookName: 'Calculus', borrowDateTime: '2023-11-01T14:30', expectedReturnDateTime: '2023-11-15T14:30', status: 'PENDING' },
        { id: 'TRX-1003', studentName: 'Alan Turing', department: 'Computer Science', bookName: 'Introduction to Algorithms', borrowDateTime: '2023-09-01T09:15', expectedReturnDateTime: '2023-09-15T09:15', status: 'OVERDUE' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (transactionId) => {
    try {
      setProcessingId(transactionId);
      await api.put(`/transactions/return/${transactionId}`);
      await fetchTransactions(); // Refresh
    } catch (error) {
      console.error('Failed to return book', error);
      alert('Could not return the book.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get('/transactions/admin/report/download', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download report', error);
      alert('Failed to download report. API endpoint might not be available.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'RETURNED': return 'bg-green-50 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'OVERDUE': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.bookName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <Link to="/admin" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-4 sm:mb-0">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Transactions Ledger</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">A detailed list of all library borrows and returns.</p>
            </div>
            <div className="mt-4 sm:mt-0 relative rounded-md shadow-sm max-w-sm w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="input-field pl-10 sm:text-sm"
                placeholder="Search ID, Student or Book..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date/Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Return</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className={tx.status === 'OVERDUE' ? 'bg-red-50/30' : tx.status === 'RETURNED' ? 'bg-green-50/30' : tx.status === 'PENDING' ? 'bg-yellow-50/30' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tx.studentName}</div>
                        <div className="text-sm text-gray-500">{tx.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.bookName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.borrowDateTime).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.expectedReturnDateTime).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {tx.status !== 'RETURNED' ? (
                          <button
                            onClick={() => handleReturnBook(tx.id)}
                            disabled={processingId === tx.id}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors disabled:opacity-50"
                          >
                            {processingId === tx.id ? 'Processing...' : 'Return Book'}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">Returned</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
