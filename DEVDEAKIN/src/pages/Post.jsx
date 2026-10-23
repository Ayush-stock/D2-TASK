import { useState } from "react";

function Post() {
    const [postType, setPostType] = useState("Article");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        abstract: "",
        articleText: "",
        tags: ""
    });

    const [message, setMessage] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setMessage("");
    }

    function handleSubmit(event) {
        event.preventDefault();

        const title = formData.title.trim();
        const description = formData.description.trim();
        const abstract = formData.abstract.trim();
        const articleText = formData.articleText.trim();

        const tags = formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

        let error = "";

        // Check the title.
        if (title === "") {
            error = "Please enter a title.";
        }

        // Validate the Question form.
        else if (
            postType === "Question" &&
            description === ""
        ) {
            error = "Please describe your problem.";
        }

        // Validate the Article form.
        else if (
            postType === "Article" &&
            abstract === ""
        ) {
            error = "Please enter an abstract.";
        }

        else if (
            postType === "Article" &&
            articleText === ""
        ) {
            error = "Please enter the article text.";
        }

        // A maximum of three comma-separated tags is allowed.
       else if (tags.length === 0) {
    error = "Please enter at least one tag.";
}

else if (tags.length > 3) {
    error = "Please enter no more than 3 tags.";
}

        // Display an error if validation fails.
        if (error !== "") {
            setMessage(error);
            window.alert(error);
            return;
        }

        // Prepare the information for future post storage.
        const postData = {
            type: postType,
            title: title,
            tags: tags
        };

        if (postType === "Question") {
            postData.description = description;
        } else {
            postData.abstract = abstract;
            postData.articleText = articleText;
        }


        console.log("Validated post:", postData);

        const successMessage =
            "Your " +
            postType.toLowerCase() +
            " has been submitted successfully!";

        setMessage(successMessage);
        window.alert(successMessage);
    }

    return (
        <main className="post-page">
            <section className="post-container">

                <h2 className="post-heading">
                    New Post
                </h2>

                <form onSubmit={handleSubmit} noValidate>

                    {/* Select the post type */}
                    <div className="post-type">
                        <span>Select Post Type:</span>

                        <label>
                            <input
                                type="radio"
                                name="postType"
                                value="Question"
                                checked={postType === "Question"}
                                onChange={() => {
                                    setPostType("Question");
                                    setMessage("");
                                }}
                            />
                            Question
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="postType"
                                value="Article"
                                checked={postType === "Article"}
                                onChange={() => {
                                    setPostType("Article");
                                    setMessage("");
                                }}
                            />
                            Article
                        </label>
                    </div>

                    {/* Form heading */}
                    <h3 className="post-section-heading">
                        What do you want to ask or share
                    </h3>

                    <p className="post-instructions">
                        This section changes depending on the
                        type of post you select.
                        <span>
                            {" "}For a {postType.toLowerCase()},
                            the relevant fields will appear below.
                        </span>
                    </p>

                    {/* Common title field */}
                    <div className="post-field">
                        <label htmlFor="title" className="bold-label">
                            Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder={
                                postType === "Question"
                                    ? "Start your question with how, what, why, etc."
                                    : "Enter a descriptive title"
                            }
                            maxLength={150}
                            required
                        />
                    </div>

                    {/* Question-specific fields */}
                    {postType === "Question" && (
                        <div className="post-field">
                            <label htmlFor="description">
                                Describe your problem
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={10}
                                required
                            />
                        </div>
                    )}

                    {/* Article-specific fields */}
                    {postType === "Article" && (
                        <>
                            <div className="post-field">
                                <label htmlFor="abstract">
                                    Abstract
                                </label>

                                <textarea
                                    id="abstract"
                                    name="abstract"
                                    value={formData.abstract}
                                    onChange={handleChange}
                                    placeholder="Enter a 1-paragraph abstract"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="post-field">
                                <label htmlFor="articleText">
                                    Article Text
                                </label>

                                <textarea
                                    id="articleText"
                                    name="articleText"
                                    value={formData.articleText}
                                    onChange={handleChange}
                                    placeholder="Enter your article text"
                                    rows={7}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Tags field for both post types */}
                    <div className="post-field post-tags">
                        <label htmlFor="tags">
                            Tags
                        </label>

                        <input
                            id="tags"
                            name="tags"
                            type="text"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder={
                                "Add up to 3 tags, separated by commas, e.g., Java"
                            }
                        />
                    </div>

                    {/* Validation and submission feedback */}
                    {message && (
                        <p
                            className={
                                message.includes("successfully")
                                    ? "post-success"
                                    : "post-error"
                            }
                            role="status"
                        >
                            {message}
                        </p>
                    )}

                    {/* Submit button */}
                    <div className="post-button-container">
                        <button
                            type="submit"
                            className="post-submit-button"
                        >
                            Post
                        </button>
                    </div>

                </form>
            </section>
        </main>
    );
}

export default Post;