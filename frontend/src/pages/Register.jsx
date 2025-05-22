import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/register/`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.log(err);
      if (err.response?.data) {
        const values = Object.values(err.response.data).flat();
        setError(values.join(" "));
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create an Account</h2>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-200 border border-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-200 border border-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-200 border border-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter password"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-200 border border-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Confirm password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-green-600 font-semibold py-2 rounded hover:bg-gray-100 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
