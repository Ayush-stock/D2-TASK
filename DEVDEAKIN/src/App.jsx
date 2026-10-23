import "./App.css";
import { useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Post from "./pages/Post";

function PageContent() {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/" && location.hash) {
            const sectionId = location.hash.substring(1);

            requestAnimationFrame(() => {
                document.getElementById(sectionId)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        }
    }, [location.pathname, location.hash]);

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/post" element={<Post />} />
            </Routes>

            <Footer />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <PageContent />
        </BrowserRouter>
    );
}

export default App;