// src/pages/BlogList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiCalendar, FiUser, FiTag, FiFolder } from "react-icons/fi";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch categories and tags
  useEffect(() => {
    const fetchFilters = async () => {
      const tagRes = await axios.get(`${process.env.REACT_APP_API_URL}/tags/`);
      const catRes = await axios.get(`${process.env.REACT_APP_API_URL}/categories/`);
      setTags(tagRes.data);
      setCategories(catRes.data);
    };
    fetchFilters();
  }, []);

  // Fetch blogs with filters/search/page
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const params = {
          page,
          search,
          tags: selectedTag || undefined,
          category: selectedCategory || undefined,
        };
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/`, { params });
        setBlogs(response.data.results);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
      } catch (error) {
        console.error("Error loading blogs", error);
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [page, search, selectedTag, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Blogs</h1>
        </div>

        {/* 🔍 Search & Filters */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:gap-4">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
          />

          <select
            className="mt-4 md:mt-0 px-4 py-2 border rounded-lg"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            className="mt-4 md:mt-0 px-4 py-2 border rounded-lg"
            value={selectedTag}
            onChange={(e) => {
              setSelectedTag(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🔁 Blog Cards */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-indigo-500 rounded-full mx-auto"></div>
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No articles found.</p>
        ) : (
          <div className="space-y-8">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center text-sm text-gray-500 mb-2 space-x-4">
                  <span className="flex items-center">
                    <FiUser className="mr-1" /> {blog.author}
                  </span>
                  <span className="flex items-center">
                    <FiCalendar className="mr-1" />
                    {new Date(blog.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  <Link to={`/blogs/${blog.slug}`} className="hover:text-indigo-600">
                    {blog.title}
                  </Link>
                </h2>

                <p className="text-gray-700 mb-3">{blog.excerpt || blog.content.slice(0, 100)}...</p>

                <div className="flex flex-wrap gap-2 text-xs">
                  {blog.category && (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center">
                      <FiFolder className="mr-1" /> {blog.category.name}
                    </span>
                  )}
                  {blog.tags?.map((tag) => (
                    <span key={tag.id} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full flex items-center">
                      <FiTag className="mr-1" /> {tag.name}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ⏮ Pagination Controls */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={!prevPage}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!nextPage}
            className="px-4 py-2 bg-indigo-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
