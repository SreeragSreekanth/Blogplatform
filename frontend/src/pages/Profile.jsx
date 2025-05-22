import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({ bio: "", profile_picture: null });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      setUser(response.data);
      setFormData({ bio: response.data.bio || "", profile_picture: null });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "profile_picture") {
      setFormData({ ...formData, profile_picture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const form = new FormData();
    form.append("username", user.username); // must include username
    form.append("email", user.email);       // must include email
    form.append("bio", formData.bio || "");
    
    if (formData.profile_picture) {
      form.append("profile_picture", formData.profile_picture);
    }
  
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/profile/`, form, {
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
  

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
        <div className="text-xl font-semibold">Loading your profile...</div>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
        <div className="text-xl font-semibold text-red-500">Failed to load profile</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="bg-gray-800 bg-opacity-80 rounded-2xl shadow-lg p-10 w-full max-w-3xl">
        <h2 className="text-4xl font-extrabold mb-8 text-center tracking-wide">
          Your Profile
        </h2>

        {edit ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us something about yourself..."
                className="w-full rounded-lg p-3 bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Profile Picture</label>
              <input
                type="file"
                name="profile_picture"
                accept="image/*"
                onChange={handleChange}
                className="text-gray-200"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setEdit(false)}
                className="px-5 py-2 rounded-md bg-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-indigo-700 flex items-center justify-center text-4xl font-bold text-indigo-300">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-3xl font-bold">{user.username}</h3>
                <p className="text-indigo-300">{user.email}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-2">Bio</h4>
              <p className="text-gray-300">{user.bio || "No bio added yet."}</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setEdit(true)}
                className="px-6 py-3 bg-indigo-600 rounded-full hover:bg-indigo-700 transition font-semibold"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
