// src/pages/BlogList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/`);
          console.log("Fetched data:", response.data); // Debug here
          setBlogs(response.data.results); // make sure response.data is an array
        } catch (error) {
          console.error("Failed to load blogs:", error);
        }
      };      
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Latest Blogs</h1>
        {blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white shadow-md p-6 mb-6 rounded-md">
              <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-700 mb-2">{blog.excerpt}</p>
              <Link
                to={`/blogs/${blog.id}`}
                className="text-indigo-600 font-medium hover:underline"
              >
                Read more →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
