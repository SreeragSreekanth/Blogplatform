import React from "react";
import { Link } from "react-router-dom";
import { FiUser, FiCalendar, FiTag, FiFolder } from "react-icons/fi";

export default function BlogCard({ blog }) {
  return (
    <article className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
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

      <p className="text-gray-700 mb-3">
        {blog.excerpt || blog.content.slice(0, 100)}...
      </p>

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
  );
}
