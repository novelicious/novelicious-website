import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

interface Book {
  id: number;
  image: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string[];
}

const Favorites: React.FC = () => {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [booksPerPage] = useState<number>(8);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

      const fetchFavoriteBooks = axios.get(
        `http://127.0.0.1:8000/users/${userId}/favorites`
      );
      const fetchRecommendedBooks = axios.get(
        `http://127.0.0.1:8000/recommend/${userId}?N=4`
      );

      Promise.all([fetchFavoriteBooks, fetchRecommendedBooks])
        .then((res) => {
          setFavoriteBooks(res[0].data);
          setRecommendedBooks(res[1].data.recommendations);
        })
        .catch(() => {
          setError("Failed to fetch books data.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

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

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = favoriteBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(favoriteBooks.length / booksPerPage);
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

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
        <header className="sticky top-0 bg-neutral z-50">
          <Navbar />
          <div className="mx-auto max-w-screen-xl px-6 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="mt-2">
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
                  className="mt-2 text-neutral space-nowrap bg-primary px-3 py-1.5 text-xs font-medium"
                  onClick={clearGenres}
                >
                  Clear Genres
                </button>
              )}
            </div>
          </div>
        </header>

        {loading ? (
          <>
            <div className="text-center mt-8">
              <div className="flex justify-center items-center h-96">
                <div
                  className="spinner-border border-primary animate-spin inline-block w-8 h-8 border-4 rounded-full"
                  role="status"
                >
                  <span className="visually-hidden">🥸</span>
                </div>
              </div>
            </div>
          </>
        ) : error ? (
          <>
            <p>{error}</p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold">Your Favorites</h1>
            <ul
              data-aos-anchor-placement="center-bottom"
              className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {currentBooks.map((book) => (
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
            <div className="mt-8 flex justify-center">
              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  {pageNumbers.map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1.5 ${
                        currentPage === number
                          ? "bg-primary text-neutral"
                          : "bg-neutral text-primary"
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <h1 className="text-lg font-semibold mt-8">Recommended for You</h1>
            <ul
              data-aos-anchor-placement="center-bottom"
              className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {recommendedBooks.map((book) => (
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
      </div>
    </section>
  );
};

export default Favorites;
