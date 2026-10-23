
function FeaturedTutorials() {
    return (
        <section id="tutorials" className="featured-section">
            <h1>Featured Tutorials</h1>

            <div className="card-container">
                <div className="tutorial-card">
                    <img
                        src="/images/laptop.png"
                        alt="React Components"
                    />

                    <h2>React Components</h2>

                    <p className="description">
                        Learn how to create reusable React components.
                    </p>

                    <p>★ 5</p>
                </div>

                <div className="tutorial-card">
                    <img
                        src="/images/office.png"
                        alt="Web Development"
                    />

                    <h2>Introduction to Web Development</h2>

                    <p className="description">
                        Learn the basics of creating modern websites.
                    </p>

                    <p>★ 5</p>
                </div>

                <div className="tutorial-card">
                    <img
                        src="/images/team.png"
                        alt="JavaScript"
                    />

                    <h2>Working with JavaScript</h2>

                    <p className="description">
                        Learn important JavaScript concepts.
                    </p>

                    <p>★ 4.9</p>
                </div>
            </div>

            <button className="see-more">
                See all tutorials
            </button>
        </section>
    );
}

export default FeaturedTutorials;
