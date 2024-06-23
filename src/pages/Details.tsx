import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowLeft } from "react-icons/fa6";
interface Book {
  id: number;
  image: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string;
  cost: number;
  synopsis: string;
  rating: number;
}

interface Question {
  answer: string;
}

const Details: React.FC = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (id && inputQuestion) {
      axios
        .get(
          `http://127.0.0.1:8000/ask/${id}?question=${encodeURIComponent(
            inputQuestion
          )}`
        )
        .then((res) => {
          setQuestion(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
    axios
      .get("http://127.0.0.1:8000/books/" + id)
      .then((res) => {
        setBook(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!book) {
    return null;
  }

  return (
    <>
      {/* <Navbar /> */}

      <div data-aos="fade-up" className="container mx-auto px-4 min-h-screen">
        <div className="flex flex-wrap justify-center">
          <div className="w-full bg-white ">
            <Link className=" " to={`/market`}>
              {" "}
              <FaArrowLeft />
            </Link>
            <div className=" relative min-h-[500px] h-auto w-full md:w-[85vw] mx-auto my-12 p-6 rounded-md border-3 border-gray-300 flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
                <div className="p-4">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="max-h-64 w-auto"
                  />
                </div>
              </div>

              <div className="w-full md:w-2/3 p-6">
                <h2 className="text-xl font-bold uppercase">
                  {book.title} ({book.release_year})
                </h2>

                <p className="text-gray-600 mt-2">{book.synopsis}</p>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    id="question"
                    name="question"
                    placeholder="Question..."
                    className="w-full px-3 py-2 rounded-sm  border-2 border-gray-200 focus:ring-0 focus:border-primary "
                    value={inputQuestion}
                    onChange={(e) => setInputQuestion(e.target.value)}
                    required
                  />

                  <button
                    className="mt-2 group relative inline-block text-sm font-medium text-slate-600 focus:outline-none focus:ring active:text-slate-500"
                    type="submit"
                  >
                    <span className="absolute inset-0 border border-current"></span>
                    <span className="block border border-current bg-white px-12 py-3 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
                      Ask
                    </span>
                  </button>
                </form>
                {question && (
                  <div className="mt-2 mb-0">
                    <p className=" text-primary">Answer:</p>
                    <a
                      href={`https://www.google.co.uk/search?q=${book.title}+${question.answer}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {question.answer}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          <section className=" py-24 relative">
            <h1 className="my-2 text-lg font-bold">Reviews ⭐</h1>
            <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
              <div className="grid grid-cols-1 gap-8">
                <div className="grid grid-cols-12 max-w-sm sm:max-w-full mx-auto">
                  <div className="col-span-12 lg:col-span-10 ">
                    <div className="sm:flex gap-6">
                      <img
                        src="https://pbs.twimg.com/profile_images/1011676051636879361/Omk-mxTL_400x400.jpg"
                        alt="arsene"
                        className="w-32 h-32"
                      />
                      <div className="text">
                        <p className="font-medium text-lg leading-8 text-gray-900 mb-2">
                          Arsene
                        </p>
                        <div className="flex lg:hidden items-center gap-2 lg:justify-between w-full mb-5">
                          <h1>Rate 10/10</h1>
                        </div>
                        <p className="font-normal text-base leading-7 text-gray-400 mb-4 lg:pr-8">
                          Thou art I{" "}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="lg:hidden font-medium text-sm leading-7 text-gray-400 lg:text-center whitespace-nowrap">
                            Nov 01, 2023
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-2 max-lg:hidden flex lg:items-center flex-row lg:flex-col justify-center max-lg:pt-6 ">
                    <div className="flex items-center gap-2 lg:justify-between w-full mb-5">
                      <h1>Rate 10/10</h1>
                    </div>
                    <p className="font-medium text-lg leading-8 text-gray-400 lg:text-center whitespace-nowrap">
                      Jun 18, 2024
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form className=" mt-8">
              <input
                type="text"
                id="question"
                name="question"
                placeholder="Reviews..."
                className="w-full px-3 py-2 rounded-sm  border-2 border-gray-200 focus:ring-0 focus:border-primary "
                required
              />

              <button
                className="mt-2 group relative inline-block text-sm font-medium text-slate-600 focus:outline-none focus:ring active:text-slate-500"
                type="submit"
              >
                <span className="absolute inset-0 border border-current"></span>
                <span className="block border border-current bg-white px-12 py-3 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
                  Post yours
                </span>
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default Details;
