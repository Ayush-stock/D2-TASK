
import { useState } from "react";
import { useAuth } from "../AuthContext";

function Post() {
    const { user } = useAuth();

    const [postType, setPostType] = useState("Question");
    const [postPlan, setPostPlan] = useState(
        user?.plan === "Paid" ? "Paid" : "Free"
    );

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [abstract, setAbstract] = useState("");
    const [articleText, setArticleText] = useState("");
    const [tags, setTags] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login before creating a post.");
            return;
        }

        if (!title.trim()) {
            setError("Please enter a title.");
            return;
        }

        const tagList = tags
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag !== "");

        if (tagList.length < 1 || tagList.length > 3) {
            setError("Enter between 1 and 3 tags.");
            return;
        }

        if (tagList.some(tag => tag.length > 30)) {
            setError("Each tag must be 30 characters or less.");
            return;
        }

        if (postType === "Question" && !description.trim()) {
            setError("Please enter your question description.");
            return;
        }

        if (postType === "Article" &&
            (!abstract.trim() || !articleText.trim())) {
            setError("Please enter the article abstract and text.");
            return;
        }

        const postData = {
            type: postType,
            title: title.trim(),
            tags: tagList,
            plan: postPlan
        };

        if (postType === "Question") {
            postData.description = description.trim();
        } else {
            postData.abstract = abstract.trim();
            postData.articleText = articleText.trim();
        }

        try {
            setLoading(true);

            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            });

            const responseText = await response.text();
            let data = {};

            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch {
                throw new Error("Server returned an invalid response.");
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to create post."
                );
            }

            setSuccess("Your post has been created successfully!");

            setTitle("");
            setDescription("");
            setAbstract("");
            setArticleText("");
            setTags("");
            setPostType("Question");
            setPostPlan(user?.plan === "Paid" ? "Paid" : "Free");

        } catch (err) {
            setError(err.message || "Failed to submit post.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="post-page">
            <div className="post-container">

                <h1>Create a Post</h1>

                <form onSubmit={handleSubmit}>

                    {/* Select Post Type */}
                    <div className="post-field radio-section">
                        <strong>Select Post Type:</strong>

                        <div className="radio-options">
                            <label>
                                <input
                                    type="radio"
                                    name="postType"
                                    value="Question"
                                    checked={postType === "Question"}
                                    onChange={() => setPostType("Question")}
                                />
                                Question
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="postType"
                                    value="Article"
                                    checked={postType === "Article"}
                                    onChange={() => setPostType("Article")}
                                />
                                Article
                            </label>
                        </div>
                    </div>

                    {/* Select Post Plan */}
                    <div className="post-field radio-section">
                        <strong>Select Post Plan:</strong>

                        <div className="radio-options">
                            <label>
                                <input
                                    type="radio"
                                    name="postPlan"
                                    value="Free"
                                    checked={postPlan === "Free"}
                                    onChange={() => setPostPlan("Free")}
                                />
                                Free
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="postPlan"
                                    value="Paid"
                                    checked={postPlan === "Paid"}
                                    disabled={user?.plan !== "Paid"}
                                    onChange={() => setPostPlan("Paid")}
                                />
                                Paid
                            </label>
                        </div>
                    </div>

                    <h2 className="post-section-heading">
                        What do you want to ask or share
                    </h2>

                    <p className="post-instructions">
                        This section is designed based on the type of post.
                        Enter the required information below.
                    </p>

                    {/* Title */}
                    <div className="post-field">
                        <label htmlFor="post-title">Title</label>

                        <input
                            id="post-title"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter your title"
                            maxLength={150}
                            required
                        />
                    </div>

                    {/* Question Description */}
                    {postType === "Question" && (
                        <div className="post-field">
                            <label htmlFor="post-description">
                                Question Description
                            </label>

                            <textarea
                                id="post-description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Write your question here"
                                maxLength={10000}
                                required
                            />
                        </div>
                    )}

                    {/* Article Details */}
                    {postType === "Article" && (
                        <>
                            <div className="post-field">
                                <label htmlFor="post-abstract">
                                    Abstract
                                </label>

                                <textarea
                                    id="post-abstract"
                                    value={abstract}
                                    onChange={e => setAbstract(e.target.value)}
                                    placeholder="Enter article abstract"
                                    maxLength={2000}
                                    required
                                />
                            </div>

                            <div className="post-field">
                                <label htmlFor="post-article">
                                    Article Text
                                </label>

                                <textarea
                                    id="post-article"
                                    value={articleText}
                                    onChange={e => setArticleText(e.target.value)}
                                    placeholder="Write your article here"
                                    maxLength={50000}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Tags */}
                    <div className="post-field">
                        <label htmlFor="post-tags">Tags</label>

                        <input
                            id="post-tags"
                            type="text"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                            placeholder="LIFE, THOUGHT, SCENE"
                            required
                        />

                        <small>
                            Enter 1 to 3 tags separated by commas.
                        </small>
                    </div>

                    {/* Error and Success Messages */}
                    {error && (
                        <div className="post-error" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="post-success" role="status">
                            {success}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="post-button-container">
                        <button
                            type="submit"
                            className="post-submit-button"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}

export default Post;
