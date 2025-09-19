'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import auth from '@/lib/auth';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = auth.getUser();
    if (!userData) {
      router.push('/login');
      return;
    }
    
    setUser(userData);
    checkAdminAndFetchData();
  }, [router]);

  const checkAdminAndFetchData = async () => {
    try {
      // Check if user is admin
      const adminResponse = await api.get('/admin/check');
      if (!adminResponse.data.isAdmin) {
        setError('Access denied. Admin only.');
        setLoading(false);
        return;
      }
      
      // If admin, fetch data
      await fetchData();
    } catch (error) {
      setError('Access denied. Admin only.');
      setLoading(false);
      console.error('Admin check error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [usersResponse, notesResponse] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/notes')
      ]);
      
      setUsers(usersResponse.data.users);
      setNotes(notesResponse.data.notes);
    } catch (error) {
      setError('Failed to fetch admin data');
      console.error('Admin fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/notes/${noteId}`);
        setNotes(notes.filter(note => note._id !== noteId));
      } catch (error) {
        setError('Failed to delete note');
      }
    }
  };

  const handleLogout = () => {
    auth.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading admin panel...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <div className="text-red-600 text-xl font-bold mb-4">Access Denied</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-1">Manage users and notes</p>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-base text-gray-700 font-medium">
                Admin: <span className="text-red-600">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === 'notes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Notes ({notes.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Users</h2>
            {users.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No users found</div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Joined Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              {new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All User Notes</h2>
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No notes found</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <div key={note._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{note.title}</h3>
                        <div className="text-sm text-blue-600 font-medium">
                          By: {note.userId?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Email: {note.userId?.email || 'N/A'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium"
                        title="Delete inappropriate note"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <p className="text-gray-700 text-base mb-4 line-clamp-3 leading-relaxed">
                      {note.description}
                    </p>
                    
                    <div className="text-sm text-gray-500 font-medium border-t border-gray-100 pt-3">
                      Created: {new Date(note.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}