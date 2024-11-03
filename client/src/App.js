import React, { useState, useEffect } from "react";
import Post from "./components/Post";
import PostForm from "./components/PostForm";
import "./index.css";

function App() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			const res = await fetch("/api/posts");
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

	const handlePostSubmit = async (e, content) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: content }),
			});
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			const newPostData = await res.json();
			setPosts([...posts, newPostData]);
		} catch (error) {
			console.error("Error creating post:", error);
			alert("投稿の作成に失敗しました: " + error.message);
		}
	};

	const handleEditSubmit = async (e, postId, content) => {
		e.preventDefault();
		try {
			const res = await fetch(`/api/posts/${postId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: content }),
			});

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			setPosts(
				posts.map((post) =>
					post._id === postId ? { ...post, content: content } : post
				)
			);
		} catch (error) {
			console.error("Error updating post:", error);
			alert("投稿の更新に失敗しました: " + error.message);
		}
	};

	const handleDeleteClick = async (postId) => {
		try {
			const res = await fetch(`/api/posts/${postId}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			setPosts(posts.filter((post) => post._id !== postId));
		} catch (error) {
			console.error("Error deleting post:", error);
			alert("投稿の削除に失敗しました: " + error.message);
		}
	};

	return (
		<div className="container">
			<h1>掲示板</h1>
			<PostForm onSubmit={handlePostSubmit} />
			<h2>投稿一覧</h2>
			<ul>
				{posts.map((post) => (
					<Post
						key={post._id}
						post={post}
						onEdit={handleEditSubmit}
						onDelete={handleDeleteClick}
					/>
				))}
			</ul>
		</div>
	);
}

export default App;
