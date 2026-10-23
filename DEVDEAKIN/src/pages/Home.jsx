
import Banner from "../components/Banner";
import About from "../components/About";
import Projects from "../components/Projects";
import FeaturedArticles from "../components/FeaturedArticles";
import FeaturedTutorials from "../components/FeaturedTutorials";

function Home() {
    return (
        <>
            <Banner />
            <About />
            <Projects />
            <FeaturedArticles />
            <FeaturedTutorials />
        </>
    );
}

export default Home;
