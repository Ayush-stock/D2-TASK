import { useEffect, useState } from "react";

function BrowsePosts() {
    const [posts, setPosts] = useState([]);
    const [hiddenPosts, setHiddenPosts] = useState([]);
    const [expandedPost, setExpandedPost] = useState(null);

    const [postType, setPostType] = useState("All");
    const [postPlan, setPostPlan] = useState("All");
    const [tag, setTag] = useState("");
    const [date, setDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Convert Firestore timestamp to a JavaScript date
    function getPostDate(createdAt) {
        if (!createdAt) {
            return null;
        }

        if (createdAt._seconds) {
            return new Date(createdAt._seconds * 1000);
        }

        if (createdAt.seconds) {
            return new Date(createdAt.seconds * 1000);
        }

        return new Date(createdAt);
    }

    // Get posts from backend
    async function loadPosts() {
        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem("token");

            const headers = {};

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch("/api/posts", {
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setPosts(data.posts || []);

        } catch (error) {
            setMessage(error.message || "Unable to load posts.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPosts();
    }, []);

    // Hide a post from the current list
    function hidePost(id) {
        setHiddenPosts([...hiddenPosts, id]);
    }

    // Reset all filters and hidden posts
    function resetFilters() {
        setPostType("All");
        setPostPlan("All");
        setTag("");
        setDate("");
        setHiddenPosts([]);
        setExpandedPost(null);
    }

    // Filter posts
    const filteredPosts = posts.filter(post => {
        const matchesType =
            postType === "All" || post.type === postType;

        const matchesPlan =
            postPlan === "All" || (post.plan || "Free") === postPlan;

        const matchesTag =
            tag.trim() === "" ||
            post.tags?.some(item =>
                item.toLowerCase().includes(tag.toLowerCase())
            );

        const postDate = getPostDate(post.createdAt);

        const matchesDate =
            date === "" ||
            (postDate &&
                postDate.toISOString().slice(0, 10) === date);

        const isNotHidden = !hiddenPosts.includes(post.id);

        return (
            matchesType &&
            matchesPlan &&
            matchesTag &&
            matchesDate &&
            isNotHidden
        );
    });

    return (
        <main className="browse-page">
            <section className="browse-container">

                <h1>Browse Posts</h1>

                <p>
                    Explore articles and questions shared by users.
                </p>

                {/* Filters */}
                <div className="browse-filters">

                    <div>
                        <label htmlFor="typeFilter">
                            Post Type
                        </label>

                        <select
                            id="typeFilter"
                            value={postType}
                            onChange={event =>
                                setPostType(event.target.value)
                            }
                        >
                            <option value="All">All</option>
                            <option value="Article">Article</option>
                            <option value="Question">Question</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="planFilter">
                            Post Plan
                        </label>

                        <select
                            id="planFilter"
                            value={postPlan}
                            onChange={event =>
                                setPostPlan(event.target.value)
                            }
                        >
                            <option value="All">All</option>
                            <option value="Free">Free</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tagFilter">
                            Search Tag
                        </label>

                        <input
                            id="tagFilter"
                            type="text"
                            value={tag}
                            onChange={event =>
                                setTag(event.target.value)
                            }
                            placeholder="Enter a tag"
                        />
                    </div>

                    <div>
                        <label htmlFor="dateFilter">
                            Created Date
                        </label>

                        <input
                            id="dateFilter"
                            type="date"
                            value={date}
                            onChange={event =>
                                setDate(event.target.value)
                            }
                        />
                    </div>

                </div>

                <div className="browse-actions">
                    <button
                        type="button"
                        onClick={resetFilters}
                    >
                        Reset Filters
                    </button>

                    <button
                        type="button"
                        onClick={loadPosts}
                        disabled={loading}
                    >
                        Refresh Posts
                    </button>
                </div>

                {/* Messages */}
                {message && (
                    <p role="status">
                        {message}
                    </p>
                )}

                {loading && <p>Loading posts...</p>}

                {!loading && filteredPosts.length === 0 && (
                    <p>No posts found.</p>
                )}

                {/* Post list */}
                {!loading && filteredPosts.map(post => {
                    const postDate = getPostDate(post.createdAt);

                    return (
                        <article
                            className="browse-post-card"
                            key={post.id}
                        >
                            <div className="browse-post-header">
                                <span>{post.type}</span>
                                <span>{post.plan || "Free"}</span>
                            </div>

                            <h2>{post.title}</h2>

                            <p>
                                By {post.author || "Unknown"}
                            </p>

                            {postDate && (
                                <p>
                                    {postDate.toLocaleDateString()}
                                </p>
                            )}

                            {post.type === "Question" && (
                                <p>
                                    {post.description}
                                </p>
                            )}

                            {post.type === "Article" && (
                                <p>
                                    {post.abstract}
                                </p>
                            )}

                            <div className="browse-tags">
                                {post.tags?.map((item, index) => (
                                    <span key={index}>
                                        #{item}
                                    </span>
                                ))}
                            </div>

                            {expandedPost === post.id && (
                                <div className="expanded-content">

                                    {post.type === "Article" ? (
                                        <p>{post.articleText}</p>
                                    ) : (
                                        <p>{post.description}</p>
                                    )}

                                </div>
                            )}

                            <div className="browse-post-actions">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpandedPost(
                                            expandedPost === post.id
                                                ? null
                                                : post.id
                                        )
                                    }
                                >
                                    {expandedPost === post.id
                                        ? "Show Less"
                                        : "Read More"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => hidePost(post.id)}
                                >
                                    Hide
                                </button>

                            </div>
                        </article>
                    );
                })}

            </section>
        </main>
    );
}

export default BrowsePosts;