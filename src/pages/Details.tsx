import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaPaperPlane, FaComments } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import { FaStar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import Star from "../components/FavStar";
import Recommendation from "../components/Recommendation";
import Add2Cart from "../components/Add2Cart";
import Navbar from "../components/Navbar";
interface Book {
  id: number;
  image: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string[];
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

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-x-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`h-8 w-8 shrink-0 ${
            index < Math.round(rating) ? "fill-primary" : "fill-gray-300"
          }`}
          viewBox="0 0 256 256"
        >
          <path d="M239.2 97.4A16.4 16.4 0 00224.6 86l-59.4-4.1-22-55.5A16.4 16.4 0 00128 16h0a16.4 16.4 0 00-15.2 10.4L90.4 82.2 31.4 86A16.5 16.5 0 0016.8 97.4 16.8 16.8 0 0022 115.5l45.4 38.4L53.9 207a18.5 18.5 0 007 19.6 18 18 0 0020.1.6l46.9-29.7h.2l50.5 31.9a16.1 16.1 0 008.7 2.6 16.5 16.5 0 0015.8-20.8l-14.3-58.1L234 115.5A16.8 16.8 0 00239.2 97.4z"></path>
        </svg>
      ))}
    </div>
  );
};

const Details: React.FC = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  // const [error, setError] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("user_id");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [favs, setFavs] = useState<number[]>([]);

  const onStarToggledHandler = (bookId: number) => {
    toast.success("Sucessfully added to favorites!", {
      icon: <FaStar />,
    });
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      console.log("User is not logged in.");
      return;
    }
    axios
      .post(`http://127.0.0.1:8000/users/${userId}/setfav`, null, {
        params: {
          book_id: bookId,
        },
      })
      .catch((err) => console.log(err));
  };

  const onUntoggledHandler = (bookId: number) => {
    const userId = localStorage.getItem("user_id");
    toast.error("Removed from favorites!", {
      icon: <FaTrash />,
    });
    if (!userId) {
      console.log("User is not logged in.");
      return;
    }
    axios
      .post("http://127.0.0.1:8000/users/" + userId + "/removefav", null, {
        params: {
          book_id: bookId,
        },
      })
      // .then(() => {
      //   window.location.reload();
      // })
      .catch((err) => console.log(err));
  };

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

    const getRecommendation = () => {
      axios
        .get(`http://127.0.0.1:8000/books/${id}/simmilar?num_book=4`)
        .then((res) => {
  
          const transformedBooks = res.data.recommendations.map(
            (book: Omit<Book, "genres"> & { genres: string | null }) => ({
              ...book,
              genres: book.genres
                ? book.genres.split(",").map((genre: string) => genre.trim())
                : [],
            })
          );
          console.log(transformedBooks);
          setRecommendedBooks(transformedBooks);
        })
        .catch(() => {
          console.log("error bro");
        })
        .finally(() => {
        });
    }

    setLoading(true);

    const token = localStorage.getItem("token");
    if (token){
      setIsLoggedIn(true);
    }
    console.log(isLoggedIn);
    
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/books/${id}/reviews`
        );
        setReviews(response.data);
        setReviewCount(response.data.length);
        const totalRating = response.data.reduce(
          (sum: number, review: Review) => sum + review.ratings,
          0
        );
        const avgRating = totalRating / response.data.length;
        setAverageRating(avgRating);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();

    axios
      .get("http://127.0.0.1:8000/books/" + id)
      .then((res) => {
        setRecommendedBooks([]);
        setBook(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        getRecommendation();
      });
  }, [id]);


  useEffect(() => {
    if (!userId) {
      console.log("User is not logged in.");
      return;
    }
    axios
      .get("http://127.0.0.1:8000/users/" + userId + "/favorites")
      .then((res) => {
        const response = res.data;
        const ids: number[] = [];
        response.forEach((element: { id: number }) => {
          ids.push(element.id);
        });
        setFavs(ids);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // useEffect(() => {
    
  // }, [id]);

  const handleSubmitReview = async () => {
    if (reviewText.trim() === "") {
      alert("Review cannot be empty.");
      return;
    }
    window.location.reload();
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
            const totalRating = res.data.reduce(
              (sum: number, review: Review) => sum + review.ratings,
              0
            );
            const avgRating = totalRating / res.data.length;
            setAverageRating(avgRating);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TailSpin height={80} width={80} color="black" />
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div>
        <header className="sticky top-0 bg-neutral z-50">
          <Navbar />
        </header>
        <div className="flex flex-wrap justify-center ">
          <div className="w-full  animate-fade">
            <section className=" bg-white relative min-h-[500px] h-auto w-full md:w-[85vw] mx-auto mt-12 p-6 rounded-md border-3 border-gray-300 flex flex-col md:flex-row">
              <div className="absolute top-0 left-0 p-4">
                <Link className="inline-flex py-2 px-6" to={`/market`}>
                  <IoMdArrowRoundBack />
                </Link>
              </div>
              <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
                <div className="p-4">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="max-h-64 w-auto border-4 border-b-primary mb-2"
                  />
                  {isLoggedIn && (
                  <div className="my-3 flex items-center">
                    <Star
                      toggled={favs.includes(book.id)}
                      bookId={book.id}
                      onToggled={() => onStarToggledHandler(book.id)}
                      onUntoggled={() => onUntoggledHandler(book.id)}
                      isShowText={true}
                    />
                  </div>
                  )}
                </div>
              </div>
              <div className="w-full md:w-2/3 p-6">
                <h2 className="text-xl font-bold uppercase">
                  {book.title} ({book.release_year})
                </h2>
                {isLoggedIn ? (
                  <div className="my-3 w-1/3 box-content">
                    <Add2Cart id={book.id} />
                  </div>
                ) : (
                  <></>
                )}
                <div className="flex flex-col">
                  <StarRating rating={averageRating} />
                  {typeof averageRating === "number" && !isNaN(averageRating)
                    ? averageRating
                    : 0}{" "}
                  out of 5 ({reviewCount} Reviews)
                </div>

                <p className="text-gray-600 mt-2">{book.synopsis}</p>
              </div>
            </section>

            <section className="w-full md:w-[85vw] mx-auto p-6 mt-6 bg-white rounded-md border-3 border-gray-300">
              <h3 className="text-lg font-semibold mb-4">
                {reviewCount} Reviews
              </h3>
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <li
                    key={review.id}
                    className="p-4 border-2 border-gray-300 rounded-md"
                  >
                    <p className="font-semibold">{review.user.username}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                    <StarRating rating={review.ratings} />
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
              {isLoggedIn && (
                <div className="mt-4">
                  <textarea
                    className="w-full p-2 border-2 border-gray-300 rounded-md resize-none"
                    rows={4}
                    placeholder="Write your review here..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>
                  <button
                    className="mt-2 px-4 py-2 bg-primary text-white rounded-md"
                    onClick={handleSubmitReview}
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>

        <section className="animate-fade mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
          <h1 className="text-lg font-semibold">
            Readers <i>also</i> enjoyed
          </h1>

          <Recommendation 
            isLoggedIn={isLoggedIn} 
            favs={favs} 
            recommendedBooks={recommendedBooks} 
            onStarToggle={onStarToggledHandler} 
            onStarUnToggle={onUntoggledHandler} 
          />
        </section>
      </div>
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
                    <li>- You must ask questions related to this book.</li>
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
    </>
  );
};

export default Details;
