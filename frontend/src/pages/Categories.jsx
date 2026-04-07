import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, ArrowLeft, Layers, Compass, Book, Tag } from 'lucide-react';

const Categories = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCategoryClick = (category) => {
    navigate(`/student?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Student Portal</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/student" className="text-gray-500 hover:text-indigo-600 font-medium px-3 py-2 rounded-md text-sm transition-colors flex items-center">
                <BookOpen className="h-4 w-4 mr-1" /> Browse Books
              </Link>
              <Link to="/student/my-books" className="text-gray-500 hover:text-indigo-600 font-medium px-3 py-2 rounded-md text-sm transition-colors flex items-center">
                <BookOpen className="h-4 w-4 mr-1" /> My Books
              </Link>
              <div className="text-sm hidden md:block border-l border-gray-200 pl-4 h-8 pt-1">
                <p className="font-medium text-gray-900 leading-tight">{user?.fullName || 'Student'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                <LogOut className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/student" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <div className="mt-4 flex items-center">
            <Layers className="h-8 w-8 text-indigo-500 mr-3" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Book Categories</h1>
          </div>
          <p className="mt-2 text-lg text-gray-500 max-w-3xl">
            Explore our vast library collection by browsing specific genres and academic departments.
          </p>
        </div>

        <div className="space-y-12">
          {/* Fiction Section */}
          <section>
            <div className="flex items-center mb-6 border-b border-gray-200 pb-3">
              <Compass className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Fiction</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {fictionCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="group relative flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 overflow-hidden text-center h-full min-h-[100px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Tag className="h-5 w-5 text-purple-400 mb-2 group-hover:scale-110 group-hover:text-purple-600 transition-transform relative z-10" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 relative z-10">
                    {category}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Non-Fiction Section */}
          <section>
            <div className="flex items-center mb-6 border-b border-gray-200 pb-3">
              <Book className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Non-Fiction & Academic</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {nonFictionCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="group relative flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden text-center h-full min-h-[100px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Tag className="h-5 w-5 text-blue-400 mb-2 group-hover:scale-110 group-hover:text-blue-600 transition-transform relative z-10" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 relative z-10">
                    {category}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Categories;
