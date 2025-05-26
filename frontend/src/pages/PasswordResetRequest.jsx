import React, { useState } from "react";
import axios from "axios";

export default function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/password-reset/`, { email });
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setError("Failed to send reset email. Please check the email address.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Reset Password</h2>

        {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-200 border border-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-blue-600 font-semibold py-2 rounded hover:bg-gray-100 transition"
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
}
