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

interface Review {
  id: number;
  comment: string;
  ratings: number;
  user: {
    username: string;
  };
  created_at: string;
}

const Details: React.FC = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("user_id");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/books/${id}/reviews`
        );
        setReviews(response.data);
        setReviewCount(response.data.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitReview = async () => {
    if (reviewText.trim() === "") {
      alert("Review cannot be empty.");
      return;
    }
    setLoading(true);
    axios
      .post(
        `http://127.0.0.1:8000/books/${id}/review?user_id=${userId}&review_text=${encodeURIComponent(
          reviewText
        )}`
      )
      .then(() => {
        setReviewText("");
        setLoading(false);

        axios
          .get(`http://127.0.0.1:8000/books/${id}/reviews`)
          .then((res) => {
            setReviews(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  if (!book) {
    return null;
  }

  return (
    <>
      <div data-aos="fade-up" className="mx-auto px-4 min-h-screen relative">
        <div className="flex flex-wrap justify-center">
          <div className="w-full">
            <section className="shadow-lg bg-white relative min-h-[500px] h-auto w-full md:w-[85vw] mx-auto my-12 p-6 rounded-md border-3 border-gray-300 flex flex-col md:flex-row">
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
                    className="max-h-64 w-auto border-4 border-b-primary"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3 p-6">
                <h2 className="text-xl font-bold uppercase">
                  {book.title} ({book.release_year})
                </h2>
                <p className="text-gray-600 mt-2">{book.synopsis}</p>
              </div>
            </section>
          </div>
        </div>

        <section className="w-full md:w-[85vw] mx-auto p-6 bg-white rounded-md border-3 shadow-lg border-gray-300">
          <h1 className="text-lg font-bold">{reviewCount} Reviews</h1>

          {isLoggedIn ? (
            <div className="my-4">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-2 border rounded resize-none"
                placeholder="Write your review here..."
                required
              />
              <button
                onClick={handleSubmitReview}
                className="mt-2 px-4 py-2 bg-primary text-white rounded"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Send"}
              </button>
            </div>
          ) : (
            <>{""}</>
          )}

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 mb-4 border-b border-gray-300"
              >
                <p className="text-gray-600">
                  <strong>{review.user.username}</strong> -{" "}
                  {new Date(review.created_at).toLocaleDateString()}
                </p>

                <div className="flex gap-x-0.5 ">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      className={`h-8 w-8 shrink-0 ${
                        index < (review.ratings > 0 ? review.ratings : 1)
                          ? "fill-primary"
                          : "fill-gray-300"
                      }`}
                      viewBox="0 0 256 256"
                    >
                      <path d="M239.2 97.4A16.4 16.4 0 00224.6 86l-59.4-4.1-22-55.5A16.4 16.4 0 00128 16h0a16.4 16.4 0 00-15.2 10.4L90.4 82.2 31.4 86A16.5 16.5 0 0016.8 97.4 16.8 16.8 0 0022 115.5l45.4 38.4L53.9 207a18.5 18.5 0 007 19.6 18 18 0 0020.1.6l46.9-29.7h.2l50.5 31.9a16.1 16.1 0 008.7 2.6 16.5 16.5 0 0015.8-20.8l-14.3-58.1L234 115.5A16.8 16.8 0 00239.2 97.4z"></path>
                    </svg>
                  ))}
                </div>

                <p className="text-gray-800 mt-2 ">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No reviews available.</p>
          )}
        </section>

        <div
          className={`sticky bottom-4 right-4 ml-auto ${
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
              <div className="p-4">
                <FaComments />
              </div>
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
                      <li>
                        - You must ask questions related to this book. For
                        example:
                      </li>
                      <li>- "What is the title?"</li>
                      <li>- "What are the genre?"</li>
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
                    <div className="bg-gray-200 p-2 rounded mt-1 break-words">
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
