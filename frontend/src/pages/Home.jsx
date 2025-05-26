import React from "react";

export default function Home() {
  return (
    <main
      className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white flex items-center justify-center px-6"
      role="main"
      aria-label="Welcome section"
    >
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight">Welcome to BlogSphere</h1>
        <p className="text-xl text-indigo-300 mb-8 max-w-xl mx-auto leading-relaxed">
          Share your thoughts, ideas, and stories with the world. Explore what others are saying and join the conversation.
        </p>
        <a
          href="/blogs"
          className="bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 text-white px-6 py-3 rounded-full font-semibold transition"
          aria-label="Explore Blogs"
        >
          Explore Blogs
        </a>
      </div>
    </main>
  );
  
}
