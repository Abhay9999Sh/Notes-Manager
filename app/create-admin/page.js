'use client';

import { useState } from 'react';

export default function CreateAdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const createAdmin = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Failed to create admin user');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Admin User</h1>
          <p className="text-gray-600 mb-8">One-time setup for admin functionality</p>
          
          {!result && !error && (
            <button
              onClick={createAdmin}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Creating Admin User...' : 'Create Admin User'}
            </button>
          )}

          {result && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">✅ Admin User Created!</h3>
              <div className="text-left space-y-2">
                <p><strong>Email:</strong> {result.email}</p>
                <p><strong>Password:</strong> {result.password}</p>
                <p className="text-sm text-green-600 mt-4">{result.note}</p>
              </div>
              <div className="mt-6 space-y-3">
                <a
                  href="/login"
                  className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Login
                </a>
                <a
                  href="/dashboard"
                  className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">❌ Error</h3>
              <p>{error}</p>
              <button
                onClick={createAdmin}
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="mt-8 text-sm text-gray-500">
            <p>This page is for one-time admin user creation.</p>
            <p>After creating the admin, you can delete this page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}