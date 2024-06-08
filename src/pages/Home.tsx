import { useEffect } from "react";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";

const Home: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Global animation duration
      once: false, // Only once animation
    });
  }, []);
  return (
    <>
      <Navbar />
    </>
  );
};

export default Home;
