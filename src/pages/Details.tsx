import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
interface Book {
  id: number;
  cover: string;
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
      duration: 1000, // Global animation duration
      once: false, // Only once animation
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
      <Navbar />
      <div data-aos="fade-up" className="container mx-auto px-4 min-h-screen">
        <div className="flex flex-wrap justify-center">
          <div className="w-full">
            <div className="bg-white relative min-h-[500px] h-auto w-full md:w-[85vw] mx-auto my-12 p-6 rounded-md border-3 border-gray-300 flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
                <div className="p-4">
                  <img
                    src={book.cover}
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
        </div>
      </div>
    </>
  );
};

export default Details;
