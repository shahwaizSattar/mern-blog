import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getCurrentUserId } from '../utils';

const UserBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const userId = getCurrentUserId();
        const res = await axios.get(`http://localhost:5000/api/posts/user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user posts');
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Blog Posts</h2>
      {posts.length === 0 ? (
        <p>You haven't created any blog posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white shadow overflow-hidden sm:rounded-lg flex flex-col h-full">
              {post.image && (
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4 flex-grow">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  <Link to={`/posts/${post._id}`} className="hover:underline">{post.title}</Link>
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Created on {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {post.content.substring(0, 100)}
                  {post.content.length > 100 ? '...' : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogs;

