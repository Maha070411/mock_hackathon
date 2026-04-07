import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, BookOpen, Save } from 'lucide-react';

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    department: '',
    totalCopies: 1
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fictionCategories = [
    'Action & Adventure', 'Contemporary Fiction', 'Dystopian', 'Fantasy', 
    'Graphic Novel', 'Historical Fiction', 'Horror', 'Literary Fiction', 
    'Mystery & Crime', 'Romance', 'Science Fiction', 'Short Story', 
    'Thriller & Suspense', 'Western', 'Women’s Fiction'
  ];

  const nonFictionCategories = [
    'Art & Photography', 'Biography & Autobiography', 'Business & Economics', 
    'Cookbooks, Food & Drink', 'Crafts & Hobbies', 'Health, Fitness & Dieting', 
    'History', 'Humor', 'Memoir', 'Philosophy', 'Politics & Social Sciences', 
    'Reference', 'Religion & Spirituality', 'Science & Technology', 
    'Self-Help', 'Travel', 'True Crime'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'totalCopies' ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/books/add', { ...formData, availableCopies: formData.totalCopies });
      setMessage({ type: 'success', text: 'Book added successfully!' });
      setFormData({ title: '', author: '', department: '', totalCopies: 1 });
      setTimeout(() => navigate('/admin'), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add book.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/admin" className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </Link>

        <div className="bg-white shadow-sm sm:rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-indigo-600 px-4 py-5 sm:px-6 flex items-center">
            <BookOpen className="h-6 w-6 text-white mr-3" />
            <h3 className="text-xl leading-6 font-bold text-white">Add New Book</h3>
          </div>
          
          <div className="px-4 py-5 sm:p-6 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {message.text && (
                <div className={`p-4 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {message.text}
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Book Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    autoFocus
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. Clean Code"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    id="author"
                    required
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. Robert C. Martin"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Category (Department) <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="" disabled>Select a Category...</option>
                    
                    <optgroup label="Fiction">
                      {fictionCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </optgroup>

                    <optgroup label="Non-Fiction">
                      {nonFictionCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="totalCopies" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Copies <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalCopies"
                    id="totalCopies"
                    min="1"
                    required
                    value={formData.totalCopies}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Initial quantity added to inventory.</p>
                </div>
              </div>

              <div className="flex justify-end pt-5 border-t border-gray-200 mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Processing...' : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Book
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
