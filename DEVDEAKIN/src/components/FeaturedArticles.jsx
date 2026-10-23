
import ArticleCard from "./ArticleCard";

const articles = [
    {
        id: 1,
        title: "Introduction to React",
        description:
            "Learn the fundamentals of React components and JSX.",
        author: "Ayush",
        rating: 5,
        image: "/images/tech.png"
    },
    {
        id: 2,
        title: "Understanding Web Development",
        description:
            "Explore the fundamentals of modern web development.",
        author: "Rahul",
        rating: 5,
        image: "/images/web.png"
    },
    {
        id: 3,
        title: "Building Modern Applications",
        description:
            "Learn important concepts for developing modern applications.",
        author: "John",
        rating: 4.9,
        image: "/images/comp.png"
    }
];

function FeaturedArticles() {
    return (
        <section id="articles" className="featured-section">
            <h1>Featured Articles</h1>

            <div className="card-container">
                {articles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                    />
                ))}
            </div>

            <button className="see-more">
                See all articles
            </button>
        </section>
    );
}

export default FeaturedArticles;
