import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages (we will create these soon)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />           {/* Home page */}
        <Route path="/login" element={<Login />} />     {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Register page */}
        <Route path="/profile/:id" element={<Profile />} /> {/* Profile page */}
      </Routes>
    </Router>
  );
}

export default App;
