import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaPaperPlane, FaComments } from "react-icons/fa";

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
  question: string;
  answer: string;
}

const Details: React.FC = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
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
          setQuestions([
            ...questions,
            { question: inputQuestion, answer: res.data.answer },
          ]);
          setInputQuestion("");
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
      <div data-aos="fade-up" className="mx-auto px-4 min-h-screen relative">
        <div className="flex flex-wrap justify-center">
          <div className="w-full">
            <div className="bg-white relative min-h-[500px] h-auto w-full md:w-[85vw] mx-auto my-12 p-6 rounded-md border-3 border-gray-300 flex flex-col md:flex-row">
              <div className="absolute top-0 left-0 p-4">
                <Link className="inline-flex py-2 px-6" to={`/market`}>
                  <IoMdArrowRoundBack className="text-[5vh]" />
                </Link>
              </div>
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
              </div>
            </div>
          </div>
        </div>
        <div
          className={`fixed bottom-4 right-4 ${
            isChatOpen ? "w-80 h-96" : "w-12 h-12"
          } transition-all duration-300 bg-white shadow-lg rounded-lg overflow-hidden z-50`}
        >
          <button
            className="flex items-center justify-center bg-primary text-white"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            {isChatOpen ? (
              // <FaChevronDown className="px-5 text-xl" />
              <p className="px-5 text-xl">-</p>
            ) : (
              <FaComments />
            )}
          </button>
          {isChatOpen && (
            <div className="flex flex-col h-full">
              <div className="flex-grow overflow-y-scroll p-4">
                <div className="mb-2">
                  <div className="bg-gray-200 p-2 rounded mt-1">
                    <p className="font-semibold">Novelicious:</p>
                    <p>How to use it?</p>
                    <ul>
                      <li>- You must ask questions related to this book.</li>
                      <li>- Remember, it is not a chatbot.</li>
                      <li>
                        - So, the answer that is not in the context will
                        probably be wrong.
                      </li>
                    </ul>
                  </div>
                </div>
                {questions.map((q, index) => (
                  <div key={index} className="mb-2">
                    <div className="bg-primary text-neutral p-2 rounded">
                      <p className="font-semibold">You:</p>
                      <p>{q.question}</p>
                    </div>
                    <div className="bg-gray-200 p-2 rounded mt-1">
                      <p className="font-semibold">Novelicious:</p>
                      <p>{q.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex w-full">
                <input
                  type="text"
                  id="question"
                  name="question"
                  placeholder="Ask a question..."
                  className="w-full p-2 mb-8 border-2 rounded border-primary"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  required
                />
                <button
                  className="bg-primary p-2 mb-8 rounded-r text-white"
                  type="submit"
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Details;
