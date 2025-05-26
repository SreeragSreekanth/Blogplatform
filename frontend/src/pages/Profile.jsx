import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUser, FiCalendar, FiTag, FiFolder } from "react-icons/fi";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [ownBlogs, setOwnBlogs] = useState([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState("own");
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({ bio: "", profile_picture: null });
  const [loading, setLoading] = useState(true);

  // Fetch user profile and blogs
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      };

      const profileRes = await axios.get(`${API}/profile/`, { headers });
      setUser(profileRes.data);
      setFormData({ bio: profileRes.data.bio || "", profile_picture: null });

      const ownBlogsRes = await axios.get(`${API}/profile/blogs/`, { headers });
      setOwnBlogs(ownBlogsRes.data.results);

      const bookmarkedRes = await axios.get(`${API}/profile/bookmarked/`, { headers });
      setBookmarkedBlogs(bookmarkedRes.data.results);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input changes for edit form
  const handleChange = (e) => {
    if (e.target.name === "profile_picture") {
      setFormData({ ...formData, profile_picture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Submit updated profile data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("username", user.username); // usually required by backend
    form.append("email", user.email);       // usually required by backend
    form.append("bio", formData.bio || "");

    if (formData.profile_picture) {
      form.append("profile_picture", formData.profile_picture);
    }

    try {
      await axios.put(`${API}/profile/`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setEdit(false);
      fetchProfile();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // Render blog card UI
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
          <span
            key={tag.id}
            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full flex items-center"
          >
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        <div className="text-xl font-semibold">Loading your profile...</div>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
        <div className="text-xl font-semibold">Failed to load profile</div>
      </div>
    );

    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <header className="flex flex-col items-center mb-10">
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={`${user.username}'s profile picture`}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-indigo-500 shadow-md"
              />
            ) : (
              <div
                role="img"
                aria-label={`${user.username} profile initial`}
                className="w-24 h-24 rounded-full bg-indigo-300 flex items-center justify-center text-5xl font-bold text-indigo-700 mb-4 shadow-md"
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 leading-snug">{user.username}</h1>
            <p className="text-gray-500 mt-2 max-w-md text-center leading-relaxed">{user.bio || "No bio provided."}</p>
    
            {/* Edit Profile Button */}
            {!edit && (
              <button
                onClick={() => setEdit(true)}
                className="mt-4 px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                aria-label="Edit Profile"
              >
                Edit Profile
              </button>
            )}
          </header>
    
          {/* Edit Profile Form */}
          {edit && (
            <form
              onSubmit={handleSubmit}
              className="mb-10 max-w-2xl mx-auto space-y-6"
              aria-label="Edit Profile Form"
            >
              <div>
                <label htmlFor="bio" className="block text-gray-700 mb-2 font-medium">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us something about yourself..."
                  className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
    
              <div>
                <label htmlFor="profile_picture" className="block text-gray-700 mb-2 font-medium">
                  Profile Picture
                </label>
                <input
                  id="profile_picture"
                  type="file"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleChange}
                  className="text-gray-700"
                />
              </div>
    
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEdit(false)}
                  className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
    
          {/* Toggle Tabs */}
          {!edit && (
            <nav className="flex justify-center space-x-4 mb-10" role="tablist" aria-label="Blog Tabs">
              <button
                onClick={() => setActiveTab("own")}
                className={`px-4 py-2 rounded-full font-medium ${
                  activeTab === "own"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-indigo-400 transition`}
                role="tab"
                aria-selected={activeTab === "own"}
                aria-controls="own-blogs-panel"
                id="own-blogs-tab"
              >
                Own Blogs
              </button>
              <button
                onClick={() => setActiveTab("bookmarked")}
                className={`px-4 py-2 rounded-full font-medium ${
                  activeTab === "bookmarked"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-indigo-400 transition`}
                role="tab"
                aria-selected={activeTab === "bookmarked"}
                aria-controls="bookmarked-blogs-panel"
                id="bookmarked-blogs-tab"
              >
                Bookmarked Blogs
              </button>
            </nav>
          )}
    
          {/* Blog List */}
          {!edit && (
            <section
              id={activeTab === "own" ? "own-blogs-panel" : "bookmarked-blogs-panel"}
              role="tabpanel"
              aria-labelledby={activeTab === "own" ? "own-blogs-tab" : "bookmarked-blogs-tab"}
              className="transition-opacity duration-300"
            >
              {renderBlogList()}
            </section>
          )}
        </div>
      </main>
    );
    
}
