const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // CORSミドルウェアをインポート

const app = express();
const port = 3001;

// CORSの設定。すべてのオリジンを許可
app.use(cors());
// もしくは、特定のオリジンのみを許可
const corsOptions = {
	origin: "http://localhost:3000", // Reactアプリのオリジン
	optionsSuccessStatus: 200, // レスポンスのステータスコード (IE11対策)
};
app.use(cors(corsOptions));

app.use(express.json());

mongoose
	.connect("mongodb://localhost:27017/bulletin_board", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected..."))
	.catch((err) => console.error("MongoDB connection error:", err));

const postSchema = new mongoose.Schema({
	content: String,
});
const Post = mongoose.model("Post", postSchema);

app.get("/api/posts", (req, res) => {
	Post.find()
		.then((posts) => res.json(posts))
		.catch((err) => res.status(500).json({ message: err.message }));
});

app.post("/api/posts", (req, res) => {
	const newPost = new Post({
		content: req.body.content,
	});
	newPost
		.save()
		.then((post) => res.status(201).json(post))
		.catch((err) => res.status(400).json({ message: err.message }));
});

// 投稿の更新
app.put("/api/posts/:id", async (req, res) => {
	try {
		const updatedPost = await Post.findByIdAndUpdate(
			req.params.id,
			{ content: req.body.content },
			{ new: true }
		);
		if (!updatedPost) {
			return res.status(404).json({ message: "Post not found" });
		}
		res.json(updatedPost);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// 投稿の削除
app.delete("/api/posts/:id", async (req, res) => {
	try {
		const deletedPost = await Post.findByIdAndDelete(req.params.id);
		if (!deletedPost) {
			return res.status(404).json({ message: "Post not found" });
		}
		res.json({ message: "Post deleted" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

app.listen(port, () => console.log(`Server started on port ${port}`));
