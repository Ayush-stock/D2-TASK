
import { Star } from "lucide-react";

function ArticleCard({ article }) {
    return (
        <article className="article-card">
            <img
                src={article.image}
                alt={article.title}
            />

            <h2>{article.title}</h2>

            <p className="description">
                {article.description}
            </p>

            <div className="article-rating">
                <Star size={18} fill="currentColor" />

                <span>{article.rating}</span>

                <span className="author">
                    {article.author}
                </span>
            </div>
        </article>
    );
}

export default ArticleCard;
