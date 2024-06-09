import { useEffect, useState } from "react";
import AOS from "aos";
import axios from "axios";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
interface Book {
  id: number;
  cover: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string[];
  cost: number;
}

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/books").then((res) => {
      setBooks(res.data);
    });
    AOS.init({
      duration: 1000, // Global animation duration
      once: false, // Only once animation
    });
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <section data-aos="fade-up" className="text-gray-700 body-font mx-8">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Find Your Next Great Read
            </h1>
            <p className="mb-8 leading-relaxed">
              Welcome to <span className="underline"> novelicious</span>, your
              ultimate destination for discovering and enjoying books tailored
              to your taste. Our mission is to connect readers with the perfect
              books and foster a community where literature lovers can thrive.
            </p>
            <div className="flex justify-center">
              <Link
                className="ml-4 inline-flex text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg"
                to={`/market`}
              >
                {" "}
                Start exploring now!
              </Link>
            </div>
          </div>
          <div
            className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6"
            data-carousel="slide"
          >
            <Slider {...settings}>
              {books.map((book) => (
                <div key={book.id}>
                  <img
                    className="object-cover object-center rounded"
                    alt={book.title}
                    src={book.cover}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      <section
        data-aos="zoom-in"
        className="text-gray-700 body-font border-t border-primary mt-20"
      >
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-xs text-primary tracking-widest font-medium title-font mb-1">
              FEATURES
            </h2>

            <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
              novelicious.
            </h1>
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-neutral p-8 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full  text-neutral flex-shrink-0">
                    🗣️
                  </div>
                  <h2 className="text-gray-900 text-lg title-font font-medium">
                    Ask the Book Genie
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base">
                    Got a question about a book? Want to know more about an
                    author or a genre? Our AI-powered question-answering system
                    is here to help.
                  </p>
                  <a className="mt-3 text-primary inline-flex items-center">
                    Learn More
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-neutral p-8 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full  text-neutral flex-shrink-0">
                    😋
                  </div>
                  <h2 className="text-gray-900 text-lg title-font font-medium">
                    Bestsellers and New Arrivals
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base">
                    Stay updated with the latest bestsellers and new releases.
                    Don't miss out on the hottest books of the season.
                  </p>
                  <a className="mt-3 text-primary inline-flex items-center">
                    Learn More
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-neutral p-8 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full  text-white flex-shrink-0">
                    🫵
                  </div>
                  <h2 className="text-gray-900 text-lg title-font font-medium">
                    Join Our Community
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base">
                    Connect with fellow book lovers, share your reviews, and
                    participate in exciting book discussions.
                  </p>
                  <a className="mt-3 text-primary inline-flex items-center">
                    Learn More
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-aos="zoom-in" className="border-t border-primary mt-20">
        <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:h-screen lg:grid-cols-2">
            <div className="relative z-10 lg:py-16">
              <div className="relative h-64 sm:h-80 lg:h-full">
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/63/05/34/630534609ef529522ff22e5a152937c0.jpg"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="relative flex items-center bg-white">
              <span className="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16 lg:bg-white"></span>

              <div className="p-8 sm:p-16 lg:p-24">
                <h2 className="text-2xl font-bold sm:text-3xl">Our Vision</h2>

                <p className="mt-4 text-gray-600">
                  We envision a world where everyone has access to the books
                  they love and the information they need to make informed
                  reading choices. By combining technology with a deep love for
                  literature, we strive to enhance your reading experience and
                  help you discover the joy of finding that next great read.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        data-aos="zoom-in"
        className="bg-primary text-neutral py-32 min-h-screen"
      >
        <div className="container flex flex-col justify-center p-4 mx-auto md:p-8">
          <h2 className="mb-12 text-4xl font-bold leadi text-center sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col divide-y sm:px-8 lg:px-12 xl:px-32 divide-gray-700">
            <details>
              <summary className="py-2 outline-none cursor-pointer focus:underline">
                How does the recommendation system work?
              </summary>
              <div className="px-4 pb-4">
                <p>
                  Our recommendation system uses advanced algorithms to analyze
                  your reading history and preferences. By examining the genres,
                  authors, and books you enjoy, it suggests new titles that
                  match your interests.
                </p>
              </div>
            </details>
            <details>
              <summary className="py-2 outline-none cursor-pointer focus:underline">
                Can I ask any book-related question?
              </summary>
              <div className="px-4 pb-4">
                <p>
                  Yes! Our AI-powered question-answering system is designed to
                  handle all kinds of book-related queries. Whether you want to
                  know more about a specific book, author, genre, or need
                  recommendations, just ask away.
                </p>
              </div>
            </details>
            <details>
              <summary className="py-2 outline-none cursor-pointer focus:underline">
                How do I join the community?
              </summary>
              <div className="px-4 pb-4">
                <p>
                  Simply sign up for an account here. Once you're registered,
                  you can participate in discussions, and share your reviews.
                </p>
              </div>
            </details>
            <details>
              <summary className="py-2 outline-none cursor-pointer focus:underline">
                Are there any membership fees?
              </summary>
              <div className="px-4 pb-4">
                <p>novelicious offer only free membership for now.</p>
              </div>
            </details>
            <details>
              <summary className="py-2 outline-none cursor-pointer focus:underline">
                How do I report a problem with the app?
              </summary>
              <div className="px-4 pb-4">
                <p>
                  If you encounter any issues or bugs, please report them
                  through our support page or email us at ndrakita@gmail.com.
                  Our team will address the problem as soon as possible.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
