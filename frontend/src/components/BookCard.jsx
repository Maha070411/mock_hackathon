import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ExternalLink } from 'lucide-react';
import api from '../services/api';

const BookCard = ({ book, isExpanded, onToggleExpand }) => {
  const navigate = useNavigate();
  const [borrowDate, setBorrowDate] = useState('');
  const [borrowTime, setBorrowTime] = useState('');
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [localCopies, setLocalCopies] = useState(book.availableCopies);

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    setBorrowLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const expectedReturnDateTime = `${borrowDate}T${borrowTime}:00`;
      await api.post('/transactions/borrow', {
        bookId: book.id,
        expectedReturnDateTime
      });
      setMessage({ type: 'success', text: 'Book borrowed successfully!' });
      setLocalCopies(prev => Math.max(0, prev - 1));
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        onToggleExpand(); // collapse on success
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to borrow book. Try again.' });
    } finally {
      setBorrowLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setBorrowDate('');
    setBorrowTime('');
    setMessage({ type: '', text: '' });
    onToggleExpand();
  };

  return (
    <div className={`bg-white overflow-hidden shadow-sm rounded-lg border ${isExpanded ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-gray-200'} hover:shadow-md transition-all duration-300 relative flex flex-col`}>
      {/* View Details link icon */}
      <button 
        onClick={() => navigate(`/student/book/${book.id}`)}
        className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 transition-colors"
        title="View full details"
      >
        <ExternalLink className="h-5 w-5" />
      </button>

      <div className="px-4 py-5 sm:p-6 flex-1">
        <h3 className="text-lg leading-6 font-medium text-gray-900 pr-8 truncate" title={book.title}>
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">By {book.author}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {book.department}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${localCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {localCopies > 0 ? `${localCopies} Copies Available` : 'Out of Stock'}
          </span>
        </div>
      </div>
      
      <div className="px-4 pb-4 sm:px-6">
        {!isExpanded ? (
          <button
            onClick={() => onToggleExpand()}
            disabled={localCopies <= 0}
            className="w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Borrow
          </button>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
             <form onSubmit={handleBorrowSubmit}>
               <h4 className="text-sm font-semibold text-gray-900 mb-3">Borrow Request Details:</h4>
               
               {message.text && (
                 <div className={`mb-3 p-2 rounded-md text-xs font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                   {message.text}
                 </div>
               )}
               
               <div className="space-y-3">
                 <div>
                   <label htmlFor={`date-${book.id}`} className="block text-xs font-medium text-gray-700 mb-1">Return Date</label>
                   <div className="relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                       <Calendar className="h-4 w-4 text-gray-400" />
                     </div>
                     <input
                       type="date"
                       id={`date-${book.id}`}
                       required
                       min={new Date().toISOString().split('T')[0]}
                       className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                       value={borrowDate}
                       onChange={(e) => setBorrowDate(e.target.value)}
                     />
                   </div>
                 </div>
                 
                 <div>
                   <label htmlFor={`time-${book.id}`} className="block text-xs font-medium text-gray-700 mb-1">Return Time</label>
                   <div className="relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                       <Clock className="h-4 w-4 text-gray-400" />
                     </div>
                     <input
                       type="time"
                       id={`time-${book.id}`}
                       required
                       className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                       value={borrowTime}
                       onChange={(e) => setBorrowTime(e.target.value)}
                     />
                   </div>
                 </div>
                 
                 <div className="flex space-x-2 pt-2">
                   <button
                     type="button"
                     onClick={handleCancel}
                     className="flex-1 py-1.5 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     disabled={borrowLoading}
                     className="flex-1 py-1.5 px-3 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-colors"
                   >
                     {borrowLoading ? '...' : 'Submit'}
                   </button>
                 </div>
               </div>
             </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
