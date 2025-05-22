import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiCalendar, FiUser, FiTag, FiFolder } from "react-icons/fi";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}/`);
        
        // Ensure author data exists
        if (!response.data.author) {
          throw new Error("Author information missing from blog post");
        }
        
        setBlog(response.data);
      } catch (err) {
        console.error("Error loading blog:", err);
        setError(err.response?.data?.message || 
                err.message || 
                "Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <Skeleton height={40} width="80%" className="mb-4" />
          <Skeleton height={20} width="60%" />
        </div>
        <Skeleton height={400} className="mb-8 rounded-xl" />
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} height={20} width={i % 2 ? "90%" : "100%"} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Unavailable</h2>
          <p className="text-gray-600 mb-6">
            {error || "This blog post cannot be displayed."}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Home
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <header className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex items-center space-x-4 mb-6">
              <span className="flex items-center text-sm text-gray-500">
                <FiUser className="mr-1.5" />
                {blog.author}
              </span>
              <span className="flex items-center text-sm text-gray-500">
                <FiCalendar className="mr-1.5" />
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>
            
            {(blog.category || blog.tags?.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm">
                    <FiFolder className="mr-1" />
                    {blog.category.name}
                  </span>
                )}
                {blog.tags?.map(tag => (
                  <span key={tag.id} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                    <FiTag className="mr-1" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          {blog.image && (
            <figure className="w-full h-64 md:h-96 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </figure>
          )}

          <div className="p-6 md:p-8 prose prose-lg max-w-none">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {blog.content}
            </div>
          </div>

          <footer className="p-6 md:p-8 border-t border-gray-200 text-sm text-gray-500">
            Last updated: {new Date(blog.updated_at).toLocaleDateString()}
          </footer>
        </article>
      </div>
    </motion.div>
  );
}