'use client';

import { useState, useEffect } from 'react';
import { notesAPI } from '@/lib/api';
import auth from '@/lib/auth';

export default function DashboardPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = auth.getUser();
    setUser(userData);
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getAllNotes();
      setNotes(response.notes);
    } catch (error) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingNote) {
        await notesAPI.updateNote(editingNote._id, formData);
      } else {
        await notesAPI.createNote(formData);
      }
      
      setFormData({ title: '', description: '' });
      setShowForm(false);
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      setError('Failed to save note');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      description: note.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.deleteNote(noteId);
        fetchNotes();
      } catch (error) {
        setError('Failed to delete note');
      }
    }
  };

  const handleLogout = () => {
    auth.logout();
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingNote(null);
    setFormData({ title: '', description: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
              <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
              <p className="text-gray-600 mt-1">Manage your personal notes</p>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-base text-gray-700 font-medium">
                Welcome, <span className="text-blue-600">{user?.name}</span>
              </span>
              {user?.email === 'admin@notes.com' && (
                <a
                  href="/admin"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Admin Panel
                </a>
              )}
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
        {/* Add Note Button - Only show for non-admin users */}
        {user?.email !== 'admin@notes.com' && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add New Note</span>
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Add/Edit Note Form - Only show for non-admin users */}
        {showForm && user?.email !== 'admin@notes.com' && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl max-w-lg w-full shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingNote ? 'Edit Note' : 'Add New Note'}
                </h2>
                <button
                  onClick={cancelForm}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Note Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-base font-medium"
                    placeholder="Enter your note title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Note Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-base font-medium resize-none"
                    placeholder="Write your note content here..."
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold text-base shadow-md hover:shadow-lg"
                  >
                    {editingNote ? 'Update Note' : 'Add Note'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold text-base border border-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content for Admin vs Regular Users */}
        {user?.email === 'admin@notes.com' ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🛡️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
              <p className="text-gray-600 mb-6">Use the Admin Panel to manage users and notes</p>
              <a
                href="/admin"
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-semibold text-lg shadow-md hover:shadow-lg inline-block"
              >
                Go to Admin Panel
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Notes Grid for Regular Users */}
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No notes yet</div>
                <p className="text-gray-400 mt-2">Create your first note to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <div key={note._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 truncate pr-2">
                        {note.title}
                      </h3>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(note)}
                          className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-base mb-4 line-clamp-4 leading-relaxed">
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
          </>
        )}
      </div>
    </div>
  );
}