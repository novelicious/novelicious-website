import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import AOS from "aos";
import "aos/dist/aos.css";
import { IconsManifest } from "react-icons";
import { FaStar } from "react-icons/fa";
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
  const [question, setQuestion] = useState<Question | null>(null);
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("user_id");
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/books/${id}/reviews`
        );
        setReviews(response.data);
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
      <div
        data-aos="fade-up"
        className="container mx-auto px-4 min-h-screen relative"
      >
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
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    id="question"
                    name="question"
                    placeholder="Question..."
                    className="w-full px-3 py-2 rounded-sm border-2 border-gray-200 focus:ring-0 focus:border-primary"
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
                    <p className="text-primary">Answer:</p>
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
            <section className="w-full md:w-[85vw] mx-auto my-12 p-6 bg-white rounded-md border-3 shadow-lg border-gray-300">
            <h1 className="text-lg font-bold">Reviews:</h1>
              <div className="my-4">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-2 border rounded"
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
                  <p className="text-gray-800 mt-2">{review.comment}</p>
                  <p className="text-gray-800 mt-2">{review.ratings} <FaStar className="text-[5vh]" /></p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No reviews available.</p>
            )}
          </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
