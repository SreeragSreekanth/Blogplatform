import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold mb-6">Welcome to BlogSphere</h1>
        <p className="text-xl text-indigo-300 mb-8">
          Share your thoughts, ideas, and stories with the world. Explore what others are saying and join the conversation.
        </p>
        <a
          href="/blogs"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition"
        >
          Explore Blogs
        </a>
      </div>
    </div>
  );
}
