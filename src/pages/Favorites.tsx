import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import toast, { Toaster } from "react-hot-toast";
import { FaStar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";
interface Book {
  id: number;
  image: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string[];
}

interface StarProps {
  toggled: boolean;
  bookId: number;
  onToggled?: (bookId: number) => void;
  onUntoggled?: (bookId: number) => void;
}

const Star: React.FC<StarProps> = ({
  toggled,
  bookId,
  onToggled,
  onUntoggled,
}) => {
  const [isToggled, setToggled] = useState<boolean>(toggled);

  useEffect(() => {
    setToggled(toggled);
  }, [toggled]);

  return (
    <div className="text-xl font-medium ml-2">
      {isToggled ? (
        <button
          onClick={() => {
            if (onUntoggled) onUntoggled(bookId);
            setToggled(false);
          }}
        >
          ★
        </button>
      ) : (
        <button
          onClick={() => {
            if (onToggled) onToggled(bookId);
            setToggled(true);
          }}
        >
          ☆
        </button>
      )}
    </div>
  );
};

const Favorites: React.FC = () => {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Isi favorite
  const [favs, setFavs] = useState<number[]>([]);

  useEffect(() => {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
      console.log("User is not logged in.");
      return;
    }
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/users/" + userId + "/favorites")
      .then((res) => {
        setLoading(false);
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
  }, []);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("user_id");
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);
      axios
        .get(`http://127.0.0.1:8000/users/${userId}/favorites`)
        .then((res) => {
          setFavoriteBooks(res.data);
        })
        .catch(() => {
          setError("Failed to fetch books data from favorites");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  const onStarToggledHandler = (bookId: number) => {
    toast.success("Sucessfully added to favorites!", {
      icon: <FaStar />,
    });
    const userId = sessionStorage.getItem("user_id");

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
    const userId = sessionStorage.getItem("user_id");
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
      .then(() => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TailSpin height={80} width={80} color="gray" />
      </div>
    );
  }

  return (
    <section>
      <div>
        <Toaster />
      </div>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
        <header className="sticky top-0 bg-neutral z-50">
          <Navbar />
          <div className="mx-auto max-w-screen-xl px-6 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="mt-2">{/*  */}</div>
          </div>
        </header>

        {error ? (
          <>
            <p>{error}</p>
          </>
        ) : (
          <>
            {favoriteBooks.length == 0 ? (
              <>
                <p>No favs.</p>
              </>
            ) : (
              <>
                {" "}
                <h1 className="text-lg font-semibold">Your Favorites</h1>
                <ul
                  data-aos-anchor-placement="center-bottom"
                  className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {favoriteBooks.map((book) => (
                    <li
                      key={book.id}
                      className="border-primary border-2 flex flex-col"
                      data-aos="zoom-in"
                    >
                      <Link
                        to={`/novel/${book.id}`}
                        className="h-[320px] group relative block overflow-hidden"
                      >
                        <img
                          src={book.image}
                          alt={book.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[320px]"
                        />
                      </Link>
                      <div className="w-full flex justify-between">
                        <div className="flex flex-wrap gap-1"></div>
                        <Star
                          toggled={favs.includes(book.id)}
                          bookId={book.id}
                          onToggled={() => onStarToggledHandler(book.id)}
                          onUntoggled={() => onUntoggledHandler(book.id)}
                        />
                      </div>
                      <div className="relative border bg-neutral p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">
                            {book.title} ({book.release_year})
                          </h3>
                          <p className="mt-1.5 text-sm text-gray-700">
                            by {book.authors}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Favorites;
