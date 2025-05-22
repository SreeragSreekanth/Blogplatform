import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BlogEditForm() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]); // selected tags by id
  const [image, setImage] = useState(null); // file upload
  const [existingImageUrl, setExistingImageUrl] = useState(null); // existing image preview

  // Options data
  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);

  // Loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blog post, categories, and tags on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch post detail
        const postRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/posts/${slug}/`
        );

        const post = postRes.data;
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category?.id || "");
        setTags(post.tags ? post.tags.map((tag) => tag.id) : []);
        setExistingImageUrl(post.image || null);

        // Fetch categories
        const catRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/categories/`
        );
        setCategories(catRes.data.results);

        // Fetch tags
        const tagRes = await axios.get(`${process.env.REACT_APP_API_URL}/tags/`);
        setAllTags(tagRes.data.results);
      } catch (err) {
        console.error(err);
        setError("Failed to load blog post or categories/tags.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleTagChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.checked) {
      setTags([...tags, value]);
    } else {
      setTags(tags.filter((id) => id !== value));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      setError("You must be logged in to update a post.");
      return;
    }

    // Prepare form data for multipart/form-data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    tags.forEach((tagId) => formData.append("tags", tagId));
    if (image) {
      formData.append("image", image);
    }

    try {
      setError(null);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/posts/${slug}/update/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Redirect or show success
      navigate(`/blogs/${slug}`);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to update post."
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Blog Post</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="block mb-2 font-semibold">
          Title:
          <input
            type="text"
            className="w-full border p-2 rounded mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="block mb-2 font-semibold">
          Content:
          <textarea
            className="w-full border p-2 rounded mt-1"
            rows="8"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </label>

        <label className="block mb-2 font-semibold">
          Category:
          <select
            className="w-full border p-2 rounded mt-1"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="mb-4">
          <legend className="font-semibold mb-1">Tags:</legend>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <label key={tag.id} className="inline-flex items-center space-x-1">
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={tags.includes(tag.id)}
                  onChange={handleTagChange}
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block mb-4 font-semibold">
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block mt-1"
          />
          {existingImageUrl && !image && (
            <img
              src={existingImageUrl}
              alt="Current"
              className="mt-2 max-h-40 rounded"
            />
          )}
          {image && (
            <p className="mt-1 text-sm text-gray-700">{image.name}</p>
          )}
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}
