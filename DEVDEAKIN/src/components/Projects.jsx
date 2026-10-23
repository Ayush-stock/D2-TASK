
const projects = [
    {
        id: 1,
        title: "My Personal Website",
        image: "/images/website.png",
        description:
            "A personal website created using HTML and CSS."
    },
    {
        id: 2,
        title: "Simple Calculator",
        image: "/images/calculator.png",
        description:
            "A simple calculator for performing basic mathematical calculations."
    }
];

function Projects() {
    return (
        <section id="projects" className="projects-section">
            <h1>Featured Projects</h1>

            <div className="projects">
                {projects.map((project) => (
                    <div className="project" key={project.id}>
                        <img
                            src={project.image}
                            alt={project.title}
                        />

                        <div className="project-info">
                            <h2>{project.title}</h2>
                            <p>{project.description}</p>
                            <a href="#">View Project</a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Projects;
