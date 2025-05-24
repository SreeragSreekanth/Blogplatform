import React, { useState } from "react";
import axios from "axios";

export default function CommentItem({ comment, postId, fetchComments, loggedInUsername }) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = async () => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken || !replyContent.trim()) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/${postId}/comments/`,
        {
          content: replyContent,
          post: postId,
          parent: comment.id,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setReplyContent("");
      setShowReply(false);
      fetchComments();
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
  };

  const handleDelete = async () => {

    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;

    const accessToken = localStorage.getItem("access");
    if (!accessToken) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}/comments/${comment.id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchComments();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
    {comment.user?.[0]?.toUpperCase()}
    </div>
        <div className="flex-1">
          <div className="bg-gray-100 rounded-xl p-3">
            <p className="text-sm font-semibold text-gray-700">@{comment.user}</p>
            <p className="text-gray-800">{comment.content}</p>
          </div>
          <div className="text-xs text-gray-500 mt-1 flex gap-3 items-center">
            <button onClick={() => setShowReply(!showReply)} className="hover:underline">
              Reply
            </button>
            {loggedInUsername === comment.user && (
              <button onClick={handleDelete} className="text-red-600 hover:underline">
                Delete
              </button>
            )}
          </div>
          {showReply && (
            <div className="mt-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 rounded border text-sm"
                placeholder={`Reply to @${comment.user}`}
              />
              <button
                onClick={handleReply}
                className="mt-1 px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
              >
                Post Reply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replies displayed flat with mention */}
      <div className="mt-2 pl-12 space-y-2">
        {comment.replies?.map((reply) => (
          <div key={reply.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-400 text-white flex items-center justify-center text-sm font-semibold">
            {reply.user?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-xl p-3">
                <p className="text-sm font-semibold text-gray-700">
                  @{reply.user} replying to @{comment.user}
                </p>
                <p className="text-gray-800">{reply.content}</p>
              </div>
              {loggedInUsername === reply.user && (
                <button
                  onClick={async () => {
                    const confirmed = window.confirm("Are you sure you want to delete this reply?");
                    if (!confirmed) return;
                    const accessToken = localStorage.getItem("access");
                    if (!accessToken) return;

                    try {
                      await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}/comments/${reply.id}/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                      });
                      fetchComments();
                    } catch (err) {
                      console.error("Delete reply failed:", err);
                    }
                  }}
                  className="text-xs text-red-600 mt-1 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
