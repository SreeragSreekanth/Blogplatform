import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUser, FiCalendar, FiTag, FiFolder } from "react-icons/fi";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function Profile() {
  const [user, setUser] = useState({});
  const [ownBlogs, setOwnBlogs] = useState([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState("own");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        };

        const profileRes = await axios.get(`${API}/profile/`, { headers });
        setUser(profileRes.data);

        const ownBlogsRes = await axios.get(`${API}/profile/blogs/`, { headers });
        setOwnBlogs(ownBlogsRes.data.results);

        const bookmarkedRes = await axios.get(`${API}/profile/bookmarked/`, { headers });
        setBookmarkedBlogs(bookmarkedRes.data.results);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const renderBlogCard = (blog) => (
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

      <p className="text-gray-700 mb-3">
        {blog.excerpt || blog.content.slice(0, 100)}...
      </p>

      <div className="flex flex-wrap gap-2 text-xs mb-3">
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

  const renderBlogList = () => {
    const blogs = activeTab === "own" ? ownBlogs : bookmarkedBlogs;

    if (blogs.length === 0) {
      return (
        <p className="text-gray-500">
          {activeTab === "own"
            ? "You haven’t posted any blogs yet."
            : "No blogs bookmarked yet."}
        </p>
      );
    }

    return <div className="space-y-8">{blogs.map(renderBlogCard)}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
          <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
          <p className="text-gray-500 mt-2">{user.bio || "No bio provided."}</p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex justify-center space-x-4 mb-10">
          <button
            onClick={() => setActiveTab("own")}
            className={`px-4 py-2 rounded-full font-medium ${
              activeTab === "own"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Own Blogs
          </button>
          <button
            onClick={() => setActiveTab("bookmarked")}
            className={`px-4 py-2 rounded-full font-medium ${
              activeTab === "bookmarked"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Bookmarked Blogs
          </button>
        </div>

        {/* Blog List */}
        {renderBlogList()}
      </div>
    </div>
  );
}
