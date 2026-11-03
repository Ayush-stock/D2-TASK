
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleSearch(event) {
        event.preventDefault();

        const search = event.target.search.value.trim().toLowerCase();

        const sections = {
            about: "about",
            projects: "projects",
            articles: "articles",
            tutorials: "tutorials",
            contact: "contact"
        };

        if (sections[search]) {
            navigate("/#" + sections[search]);
        }
    }

    function handleLogout() {
        logout();
        navigate("/");
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
                        aria-label="Search website sections"
                    />
                </form>

                <div className="task-nav-links">

                    <Link to="/pricing" className="task-nav-link">
                        Pricing
                    </Link>

                    <Link to="/post" className="task-nav-link">
                        Post
                    </Link>

                    <Link to="/browse-posts" className="task-nav-link">
                        Browse Posts
                    </Link>

                    {user ? (
                        <>
                            <span className="task-user-info">
                                {user.name} ({user.plan || "Free"})
                            </span>

                            <button
                                type="button"
                                className="task-logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="task-nav-link">
                            Login
                        </Link>
                    )}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;
