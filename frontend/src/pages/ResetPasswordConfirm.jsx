// src/components/ResetPasswordConfirm.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== reNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/password-reset-confirm/`,
        {
          uid,
          token,
          new_password: newPassword,
          re_new_password: reNewPassword,
        }
      );
      setMessage("Password reset successful! You can now login.");
      // Optionally redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError("Failed to reset password. Please try again.");
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="new_password">
            New Password
          </label>
          <input
            id="new_password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="re_new_password">
            Confirm New Password
          </label>
          <input
            id="re_new_password"
            type="password"
            placeholder="Confirm new password"
            value={reNewPassword}
            onChange={(e) => setReNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordConfirm;
