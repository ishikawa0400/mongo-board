// API呼び出しを管理するファイル

// 共通のfetch関数を作成
const customFetch = async (url, options = {}) => {
	const defaultOptions = {
		headers: {
			"Content-Type": "application/json",
		},
		...options,
	};

	const res = await fetch(url, defaultOptions);
	if (!res.ok) {
		throw new Error(`HTTP error! status: ${res.status}`);
	}
	return res;
};

export const fetchPosts = async () => {
	const res = await customFetch("/api/posts");
	return res.json();
};

export const createPost = async (content) => {
	const res = await customFetch("/api/posts", {
		method: "POST",
		body: JSON.stringify({ content }),
	});
	return res.json();
};

export const updatePost = async (postId, content) => {
	await customFetch(`/api/posts/${postId}`, {
		method: "PUT",
		body: JSON.stringify({ content }),
	});
};

export const deletePost = async (postId) => {
	await customFetch(`/api/posts/${postId}`, {
		method: "DELETE",
	});
};
