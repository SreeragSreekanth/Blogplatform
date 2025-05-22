import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages (we will create these soon)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import BlogCreate from "./components/BlogCreate";
import BlogEditForm from "./components/BlogEditForm";




function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />           {/* Home page */}
        <Route path="/login" element={<Login />} />     {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Register page */}
        <Route path="/profile/:id" element={<Profile />} /> {/* Profile page */}
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/blogs/create" element={<BlogCreate />} />
        <Route path="/blogs/:slug/edit" element={<BlogEditForm />} />


      </Routes>
    </Router>
  );
}

export default App;
