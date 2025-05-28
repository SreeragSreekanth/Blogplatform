import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesRes, tagsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/categories/`),
          axios.get(`${process.env.REACT_APP_API_URL}/tags/`)
        ]);

        setCategories(categoriesRes.data);
        setTags(tagsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load required data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTagChange = (event) => {
    const value = event.target.value;
    setSelectedTags(prev =>
      prev.includes(value)
        ? prev.filter(t => t !== value)
        : [...prev, value]
    );
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem('access');
    if (!token) {
      setError('You must be logged in to create a blog post.');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', selectedCategory);
      // Append tags as integers (or strings depending on your backend)
      selectedTags.forEach(tagId => formData.append('tags', tagId));
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      console.log('Sending token:', token);

      await axios.post(`${process.env.REACT_APP_API_URL}/posts/create/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // DO NOT set Content-Type explicitly, axios handles it for FormData
        }
      });

      setSuccess(true);
      setError(null);
      setTitle('');
      setContent('');
      setSelectedCategory('');
      setSelectedTags([]);
      setSelectedImage(null);
      // Clear file input manually
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Error creating blog post:', err);
      // Show detailed error if available
      setError(err.response?.data?.detail || 'Failed to create blog post');
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create New Blog Post</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p>Blog post created successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
                placeholder="Enter your blog title"
              />
            </div>

            {/* Content Field */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 min-h-[200px]"
                required
                placeholder="Write your blog content here..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) && categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Tags Checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(tags) && tags.map(tag => (
                  <label key={tag.id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={tag.id.toString()}
                      checked={selectedTags.includes(tag.id.toString())}
                      onChange={handleTagChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Create Blog Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
