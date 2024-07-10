import { useEffect } from "react";
import AOS from "aos";

import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const imageUrls = [
    "https://m.media-amazon.com/images/I/81iDNjn-r3L._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/81DLO7AyKPL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71CfDuCROZL.jpg",
  ];

  useEffect(() => {
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
      <section data-aos="fade-right" className="text-gray-700 body-font mx-8">
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
                className="inline-flex text-neutral bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded text-sm"
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
              {imageUrls.map((url, index) => (
                <div key={index}>
                  <img
                    className="object-cover object-center h-[80vh]"
                    alt={`Slide ${index + 1}`}
                    src={url}
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
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header className="flex">
            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Our Novel
            </h2>

            <Link to={""} className="underline">
              Check all
            </Link>
          </header>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li>
              <a href="#" className="group block overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  alt=""
                  className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                />

                <div className="relative bg-white pt-3">
                  <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
                    Basic Tee
                  </h3>

                  <p className="mt-2">
                    <span className="sr-only"> Regular Price </span>

                    <span className="tracking-wider text-gray-900">
                      {" "}
                      £24.00 GBP{" "}
                    </span>
                  </p>
                </div>
              </a>
            </li>

            <li>
              <a href="#" className="group block overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  alt=""
                  className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                />

                <div className="relative bg-white pt-3">
                  <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
                    Basic Tee
                  </h3>

                  <p className="mt-2">
                    <span className="sr-only"> Regular Price </span>

                    <span className="tracking-wider text-gray-900">
                      {" "}
                      £24.00 GBP{" "}
                    </span>
                  </p>
                </div>
              </a>
            </li>

            <li>
              <a href="#" className="group block overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  alt=""
                  className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                />

                <div className="relative bg-white pt-3">
                  <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
                    Basic Tee
                  </h3>

                  <p className="mt-2">
                    <span className="sr-only"> Regular Price </span>

                    <span className="tracking-wider text-gray-900">
                      {" "}
                      £24.00 GBP{" "}
                    </span>
                  </p>
                </div>
              </a>
            </li>

            <li>
              <a href="#" className="group block overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  alt=""
                  className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                />

                <div className="relative bg-white pt-3">
                  <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
                    Basic Tee
                  </h3>

                  <p className="mt-2">
                    <span className="sr-only"> Regular Price </span>

                    <span className="tracking-wider text-gray-900">
                      {" "}
                      £24.00 GBP{" "}
                    </span>
                  </p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-primary text-neutral py-32 min-h-screen">
        <div
          data-aos="zoom-in"
          className="container flex flex-col justify-center p-4 mx-auto md:p-8"
        >
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
