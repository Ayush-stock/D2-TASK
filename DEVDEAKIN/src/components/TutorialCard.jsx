function TutorialCard({ tutorial }) {
    return (
        <article className="tutorial-card">

            <img
                src={tutorial.image}
                alt={tutorial.title}
            />

            <h2>{tutorial.title}</h2>

            <p className="description">
                {tutorial.description}
            </p>

            <div className="tutorial-rating">

                <span>★</span>

                <span>{tutorial.rating}</span>

                <span className="author">
                    {tutorial.author}
                </span>

            </div>

        </article>
    );
}

export default TutorialCard;