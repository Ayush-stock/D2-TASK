
import { Link } from "react-router-dom";

function Navbar() {
    function handleSearch(event) {
        event.preventDefault();

        const search = event.target.search.value
            .trim()
            .toLowerCase();

        const sections = {
            about: "about",
            projects: "projects",
            articles: "articles",
            tutorials: "tutorials",
            contact: "contact"
        };

        const sectionId = sections[search];

        if (sectionId) {
            window.location.href = "/#" + sectionId;
        }
    }

    return (
        <nav className="task-navbar">
            <div className="task-nav-inner">
                <Link to="/" className="task-logo">
                    DEV@Deakin
                </Link>

                <form
                    className="task-search-box"
                    onSubmit={handleSearch}
                >
                    <input
                        type="search"
                        name="search"
                        placeholder="Search..."
                        aria-label="Search sections"
                    />
                </form>

                <Link to="/post" className="task-nav-link">
                    Post
                </Link>

                <Link to="/login" className="task-nav-link">
                    Login
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
