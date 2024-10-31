import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');


  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("投稿の取得に失敗しました: " + error.message);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const newPostData = await res.json();
      setPosts([...posts, newPostData]);
      setNewPost('');
    } catch (error) {
      console.error("Error creating post:", error);
      alert("投稿の作成に失敗しました: " + error.message);
    }
  };


  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
  };

  const handleEditSubmit = async (e, postId) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setPosts(posts.map(post => (post._id === postId ? { ...post, content: editContent } : post)));
      setEditingPost(null);
      setEditContent('');

    } catch (error) {
      console.error("Error updating post:", error);
      alert("投稿の更新に失敗しました: " + error.message);
    }
  }

  const handleDeleteClick = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("投稿の削除に失敗しました: " + error.message);
    }
  };

  return (
    <div className="container">
      <h1>掲示板</h1>
      <form onSubmit={handlePostSubmit}>
        <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="新しい投稿を入力..." />
        <button type="submit">投稿</button>
      </form>

      <ul>
        {posts.map(post => (
          <li key={post._id} className="post-item">
            {editingPost === post ? (
              <form onSubmit={(e) => handleEditSubmit(e, post._id)}>
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                <button type="submit">保存</button>
                <button type="button" onClick={() => setEditingPost(null)}>キャンセル</button>
              </form>
            ) : (
              <div>
                <p>{post.content}</p>
                <button onClick={() => handleEditClick(post)}>編集</button>
                <button onClick={() => handleDeleteClick(post._id)}>削除</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;