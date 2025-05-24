import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentItem from "./CommentItem";

const CommentsList = ({ postId, loggedInUsername }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postId}/comments/`);
      setComments(res.data.results);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handlePostComment = async () => {
    const access = localStorage.getItem("access");
    if (!access || !newComment.trim()) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/${postId}/comments/`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${access}` } }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-10 bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Comments</h3>

      {/* Comment input */}
      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="w-full border rounded-md p-3 text-sm"
          placeholder="Write a comment..."
        />
        <button
          onClick={handlePostComment}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
        >
          Post Comment
        </button>
      </div>

      {/* List comments */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            fetchComments={fetchComments}
            loggedInUsername={loggedInUsername}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
