import React from 'react';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">403</h1>
        <p className="mt-4 text-xl text-gray-600">You do not have permission to access this page.</p>
        <a href="/" className="mt-6 inline-block text-blue-600 hover:text-blue-800">
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
