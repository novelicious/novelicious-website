import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { CartProps, CartItemProps } from "./Cart";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import BookItem from "../components/BookItem";
import { FaSearch } from "react-icons/fa";

interface Book {
  id: number;
  image: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string[];
  cost: number;
}

const Market: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // const [loading, setLoading] = useState(true);
  // Filtering & Search
  const [filterData, setFilterData] = useState<Book[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [booksPerPage] = useState<number>(8);

  //Isi Cart
  const [cartAmount, setCartAmount] = useState<number>(0);

  //Isi favorite
  const [favs, setFavs] = useState<number[]>([]);

  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const toastMessage = queryParams.get("toast");

    if (toastMessage === "checkout_success") {
      toast.success("Checkout successful!");

      queryParams.delete("toast");
      navigate({ search: queryParams.toString() }, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
    let isMounted = true;
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/books")
      .then((res) => {
        setLoading(false);
        if (isMounted) {
          const transformedBooks = res.data.map(
            (book: Omit<Book, "genres"> & { genres: string | null }) => ({
              ...book,
              genres: book.genres
                ? book.genres.split(",").map((genre: string) => genre.trim())
                : [],
            })
          );
          console.log(transformedBooks);
          setBooks(transformedBooks);
          setFilterData(transformedBooks);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const filteredBooks = filterData.filter((book) => {
      const title = book.title ? book.title.toLowerCase() : "";
      const authors = book.authors ? book.authors.toLowerCase() : "";
      const searchQueryLower = searchQuery.toLowerCase();

      return (
        (title.includes(searchQueryLower) ||
          authors.includes(searchQueryLower)) &&
        (selectedGenres.length === 0 ||
          selectedGenres.every((genre) => book.genres.includes(genre)))
      );
    });
    setBooks(filteredBooks);
    setCurrentPage(1);
  }, [searchQuery, selectedGenres, filterData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  const clearGenres = () => {
    setSelectedGenres([]);
  };

  function getCartAmount(cart: CartProps) {
    if (cart == null) return 0;
    var amount = 0;
    var books: CartItemProps[] = cart.books;
    books.forEach((book) => {
      amount += book.amount;
    });
    return amount;
  }

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/users/" + userId + "/cart")
      .then((res) => {
        const cartData = res.data;
        if (cartData === null || cartData === undefined) {
          console.log("Cart data is null or undefined");
        } else {
          setCartAmount(getCartAmount(cartData));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
  }, []);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(books.length / booksPerPage);
  const pageNumbers = [];

  const maxPageNumbersToShow = 5;
  let startPage = Math.max(
    1,
    currentPage - Math.floor(maxPageNumbersToShow / 2)
  );
  let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

  if (endPage - startPage + 1 < maxPageNumbersToShow) {
    startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TailSpin height={80} width={80} color="black" />
      </div>
    );
  }

  return (
    <section>
      <div>
        <Toaster />
      </div>

      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
        <header className="animate-fade sticky top-0 bg-neutral z-50">
          <Navbar />
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className=" sm:flex sm:items-center sm:justify-between">
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 h-10 rounded-l border-2 border-secondary focus:ring-0 focus:border-primary"
                  placeholder="Search by title, authors..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>

              <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                <select
                  className="w-full h-10 border-2 border-secondary  focus:ring-0 focus:border-primary text-primary rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
                  onChange={(e) => handleGenreChange(e.target.value)}
                  value=""
                >
                  <option value="" disabled>
                    Genres
                  </option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Romance">Romance</option>
                  <option value="Horror">Horror</option>
                  <option value="Video Game">Video Game</option>
                  <option value="Supernatural">Supernatural</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="School">School</option>
                  <option value="Vampires">Vampire</option>
                </select>

                {isLoggedIn && (
                  <Link
                    to={`/cart`}
                    className={cartAmount == 0 ? "cursor-not-allowed" : ""}
                    onClick={(event) => {
                      if (cartAmount == 0) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <div className="py-2">
                      <div className="t-0 left-3">
                        <p className="flex h-2 w-2 items-center justify-center rounded-full bg-primary p-3 text-xs text-neutral">
                          {cartAmount}
                        </p>
                      </div>
                      <AiOutlineShoppingCart />
                    </div>
                  </Link>
                )}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {selectedGenres.map((genre, index) => (
                  <span
                    key={index}
                    className="text-neutral space-nowrap bg-primary px-3 py-1.5 text-xs font-medium"
                  >
                    {genre}
                    <button
                      className="ml-2"
                      onClick={() => handleGenreChange(genre)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              {selectedGenres.length > 0 && (
                <button
                  className="mt-2 text-neutral space-nowrap bg-primary px-3 py-1.5 text-xs font-medium "
                  onClick={clearGenres}
                >
                  Clear Genres
                </button>
              )}
            </div>
          </div>
        </header>

        <ul
          data-aos-anchor-placement="center-bottom"
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {currentBooks.map((book) => (
            <BookItem
              favs={favs}
              id={book.id}
              image={book.image}
              title={book.title}
              release_year={book.release_year}
              authors={book.authors}
              genres={book.genres}
              cost={book.cost}
              onGenreClick={handleGenreChange}
            />
          ))}
        </ul>

        {totalPages > 1 && (
          <ul className="flex justify-center mt-4">
            <li className="hidden sm:block">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 border-2 ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-primary text-primary hover:bg-primary hover:text-neutral"
                }`}
              >
                Previous
              </button>
            </li>

            {startPage > 1 && (
              <>
                <li>
                  <button
                    onClick={() => paginate(1)}
                    className="px-3 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-neutral"
                  >
                    1
                  </button>
                </li>
                <li>
                  <span className="px-3 py-2 border-2 border-transparent text-primary">
                    ...
                  </span>
                </li>
              </>
            )}

            {pageNumbers.map((number, index) => (
              <li
                key={number}
                className={`${
                  // Hide some numbers on smaller screens
                  index > 1 && index < pageNumbers.length - 2
                    ? "hidden sm:block"
                    : ""
                }`}
              >
                <button
                  onClick={() => paginate(number)}
                  className={`px-3 py-2 border-2 ${
                    currentPage === number
                      ? "bg-primary text-neutral border-primary"
                      : "border-primary text-primary hover:bg-primary hover:text-neutral"
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}
            {endPage < totalPages && (
              <>
                <li>
                  <span className="px-3 py-2 border-2 border-transparent text-primary">
                    ...
                  </span>
                </li>
                <li>
                  <button
                    onClick={() => paginate(totalPages)}
                    className="px-3 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-neutral"
                  >
                    {totalPages}
                  </button>
                </li>
              </>
            )}

            <li className="hidden sm:block">
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 border-2 ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-primary text-primary hover:bg-primary hover:text-neutral"
                }`}
              >
                Next
              </button>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
};

export default Market;
