import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaPaperPlane, FaComments, FaRegStar } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import { FaStar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
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

interface StarProps {
  toggled: boolean;
  bookId: number;
  text: string;
  onToggled?: (bookId: number) => void;
  onUntoggled?: (bookId: number) => void;
}

const Star: React.FC<StarProps> = ({
  toggled,
  bookId,
  text,
  onToggled,
  onUntoggled,
}) => {
  const [isToggled, setToggled] = useState<boolean>(toggled);

  useEffect(() => {
    setToggled(toggled);
  }, [toggled]);

  return (
    <div className="font-medium ml-2">
      {isToggled ? (
        <button
          onClick={() => {
            if (onUntoggled) onUntoggled(bookId);
            setToggled(false);
          }}
          className="text-xl flex justify-between items-center"
        >
          <FaStar />
          <p className="text-sm ml-2">{text}</p>
        </button>
      ) : (
        <button
          onClick={() => {
            if (onToggled) onToggled(bookId);
            setToggled(true);
          }}
          className="text-xl flex justify-between items-center"
        >
          <FaRegStar />
          <p className="text-sm ml-2">{text}</p>
        </button>
      )}
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
  const [favs] = useState<number[]>([]);
  const [favText, setFavText] = useState<string>('Add to Favorite')

  const onStarToggledHandler = (bookId: number) => {
    toast.success("Sucessfully added to favorites!", {
      icon: <FaStar />,
    });
    setFavText("Remove from Favorite")
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
    setFavText("Add to Favorite")
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

    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/books/" + id)
      .then((res) => {
        setBook(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`http://127.0.0.1:8000/books/${id}/simmilar?num_book=4`)
      .then((res) => {
        setLoading(false);

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
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
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
  }, [id]);

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
                  {isLoggedIn ? (
                    <Star
                      toggled={favs.includes(book.id)}
                      bookId={book.id}
                      onToggled={() => onStarToggledHandler(book.id)}
                      onUntoggled={() => onUntoggledHandler(book.id)}
                      text={favText}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="w-full md:w-2/3 p-6">
                <h2 className="text-xl font-bold uppercase">
                  {book.title} ({book.release_year})
                </h2>
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

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedBooks.map((book) => (
              <li
                data-aos="fade-in"
                key={book.id}
                className="border-primary border-2 flex flex-col"
              >
                <Link
                  to={`/novel/${book.id}`}
                  className="h-[320px] group relative block overflow-hidden"
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[320px]"
                  />
                </Link>

                <div className="relative border bg-neutral p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="w-full flex justify-between">
                      <div className="flex flex-wrap gap-1">
                        {book.genres.map((genre, index) => (
                          <span
                            key={index}
                            className="text-neutral space-nowrap bg-primary px-3 py-1.5 text-xs font-medium"
                          >
                            <a
                              href="#"
                              className="text-neutral relative text-[10px] w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-neutral after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-right"
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            >
                              {genre}
                            </a>
                          </span>
                        ))}
                      </div>
                      {isLoggedIn ? (
                        <Star
                          toggled={favs.includes(book.id)}
                          bookId={book.id}
                          onToggled={() => onStarToggledHandler(book.id)}
                          onUntoggled={() => onUntoggledHandler(book.id)}
                          text=""
                        />
                      ) : (
                        <></>
                      )}
                    </div>

                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {book.title} ({book.release_year})
                    </h3>

                    <p className="mt-1.5 text-sm text-gray-700">
                      {book.authors}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
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
