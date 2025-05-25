import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const access = localStorage.getItem("access");

  const fetchNotifications = useCallback(async () => {
    if (!access) return;
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/notifications/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      setNotifications(res.data.results);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [access]);

  const markAllAsRead = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/notifications/mark-all-read/`, {}, {
        headers: { Authorization: `Bearer ${access}` },
      });
      fetchNotifications(); // refresh after marking as read
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleDropdownToggle = () => {
    const newState = !showDropdown;
    setShowDropdown(newState);
    if (!showDropdown) {
      markAllAsRead();
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleDropdownToggle} className="relative">
        <Bell className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 font-semibold border-b text-indigo-700">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500">No notifications.</div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`p-3 text-sm border-b ${
                    notif.is_read ? "text-gray-500" : "font-medium text-indigo-700"
                  }`}
                >
                  {notif.message}
                  <div className="text-xs text-gray-400">
                    {new Date(notif.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
